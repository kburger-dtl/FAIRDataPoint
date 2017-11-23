/*
 * The MIT License
 * Copyright © 2017 DTL
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var singleArrayThing = function(value) {
  return value === undefined
    ? []
    : value instanceof Array
      ? value
      : [value];
};

var trimText = function(str, limit, slop) {
  var strlimit = limit || 128;
  var limitslop = slop || 5;

  if (str.length > strlimit + limitslop) {
    return str.substring(0, strlimit) + "...";
  }
  return str;
};

var addCatalogBox = function(metadata) {
  var datasets = singleArrayThing(metadata["dcat:dataset"]);

  var box = $("<div>")
    .addClass("col-6 rounded catalog-box")
    .append($("<h3>").text(trimText(metadata["dcterms:title"])))
    .append($("<p>").text(trimText(metadata["dcterms:description"])))
    .append($("<span>").text("Datasets: " + datasets.length));
  
  box.appendTo($("#catalog-boxes"));

  box.bind("click", function(e) {
    $("#catalog-title").text(metadata["dcterms:title"]);
    $("#catalog-desc").text(metadata["dcterms:description"]);
    $("#catalog-issued").text(new Date(metadata["fdp:metadataIssued"]["@value"]).toDateString());
    $("#catalog-modified").text(new Date(metadata["fdp:metadataModified"]["@value"]).toDateString());

    // show the dataset section
    $("#catalog-section").show();
    
    // reset dataset-boxes
    $("#dataset-boxes").html("");
    
    jQuery.each(datasets, function(di, dataset) {
      queryMetadata(dataset["@id"], addDatasetBox);
    });
  });
};

var addDatasetBox = function(metadata) {
  var metadataRow = $("<div>")
    .addClass("row")
    .append(
      $("<div>")
        .addClass("col text-left")
        .text("Published: " + new Date(metadata["fdp:metadataIssued"]["@value"]).toDateString())
    ).append(
      $("<div>")
        .addClass("col text-center")
        .append(
          $("<a>")
            .attr('href', metadata["dcterms:license"]["@id"])
            .text("license")
        )
    ).append(
      $("<div>")
        .addClass("col text-right")
        .append(
          $("<span>")
            .text("Version: " + metadata["dcterms:hasVersion"])
        )
    );

  var distIconRow = $("<div>").addClass("row justify-content-center");

  var box = $("<div>")
    .addClass("col rounded catalog-box")
    .append($("<h5>").text(trimText(metadata["dcterms:title"])))
    .append($("<p>").text(trimText(metadata["dcterms:description"])))
    .append(metadataRow)
    .append(distIconRow);
  
  box.appendTo($("#dataset-boxes"));

  box.bind("click", function(e) {
    location.assign(metadata["@id"]);
  });
  
  var dists = singleArrayThing(metadata["dcat:distribution"]);
  
  if (dists.length > 0) {
    // create row of distributions
    jQuery.each(dists, function(index, dist) {
      queryMetadata(dist["@id"], function(graph) {
        distIconRow.append(
          $("<div>")
            .addClass("col text-center")
            .append(
              $("<span>")
                .text(graph["dcat:mediaType"])
                .attr("title", graph["dcat:mediaType"])
            )
        );
      });
    });
  }
};

var queryMetadata = function(uri, callback) {
  $.get({
    url: uri,
    headers: {
      Accept: "application/ld+json"
    },
    success: function(data) {
      jQuery.each(data["@graph"], function(gi, graph) {
        if (graph["@id"] === uri) {
          callback(graph);
        }
      });
    }
  });
};

var populateBreadcrumb = function(catalog) {
  queryMetadata(catalog, function(catalogGraph) {
    queryMetadata(catalogGraph["dcterms:isPartOf"]["@id"], function(fdpGraph) {
      queryMetadata(window.location.href, function(datasetGraph) {
        var fdpTitle = fdpGraph["dcterms:title"];
        var catTitle = catalogGraph["dcterms:title"];
        var dsTitle = datasetGraph["dcterms:title"];

        $("nav ol.breadcrumb")
          .append(
            $("<li>").addClass("breadcrumb-item")
              .append($("<a>").attr("href", fdpGraph["@id"]).text(fdpTitle))
          )
          .append(
            $("<li>").addClass("breadcrumb-item").text(catTitle)
          )
          .append(
            $("<li>").addClass("breadcrumb-item").text(trimText(dsTitle, 64))
          );
      });
    });
  });
};

var createDistIcon = function(dist) {
  var parent = $(document.scripts[document.scripts.length - 1].parentNode);
  queryMetadata(dist, function(graph) {
    parent.append($("<span>").addClass("badge badge-pill badge-primary").text(graph["dcat:mediaType"]));
  });
};