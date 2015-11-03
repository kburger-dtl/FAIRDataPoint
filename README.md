###SPARQL endpoint for BreeDB germplasm data

**Graph IRI: https://www.eu-sol.wur.nl/passport**

http://virtuoso.biotools.nl:8888/sparql/

###LDP server for BreeDB germplasm data

http://virtuoso.biotools.nl:8888/DAV/home/davuser/

**Access Linked Data Platform Container (LDPC)**
```
curl -iH 'Accept: text/turtle' -u davuser:davuser http://virtuoso.biotools.nl:8888/DAV/home/davuser/
```
**Access Linked Data Platform Non-RDF Source (LDP-NR)**
```
curl -iH 'Accept: text/turtle' -u davuser:davuser http://virtuoso.biotools.nl:8888/DAV/home/davuser/test.txt
```
**Access Linked Data Platform RDF Source (LDP-RS)**
```
curl -iH 'Accept: text/turtle' -u davuser:davuser http://virtuoso.biotools.nl:8888/DAV/home/davuser/germplasm.ttl
```
