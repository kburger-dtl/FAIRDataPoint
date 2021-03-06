/**
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
package nl.dtls.fairdatapoint.config;

import org.eclipse.rdf4j.model.IRI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.YamlMapFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.util.Map;

import static nl.dtls.fairdatapoint.util.HttpUtil.removeLastSlash;
import static nl.dtls.fairdatapoint.util.ValueFactoryHelper.i;

@Configuration
public class MetadataConfig {

    @Value("${instance.clientUrl}")
    private String clientUrl;

    @Bean(name = "persistentUrl")
    public String persistentUrl(@Value("${instance.persistentUrl:}") String persistentUrl) {
        if (persistentUrl == null || persistentUrl.isEmpty()) {
            return clientUrl;
        }
        return removeLastSlash(persistentUrl);
    }

    @Bean(name = "language")
    public IRI language(@Value("${metadataProperties.language:}") String languageURI) {

        IRI language = null;
        if (!languageURI.isEmpty()) {
            language = i(languageURI);
        }
        return language;
    }

    @Bean(name = "license")
    public IRI license(@Value("${metadataProperties.license:}") String licenseURI) {

        IRI license = null;
        if (!licenseURI.isEmpty()) {
            license = i(licenseURI);
        }
        return license;
    }

    @Bean(name = "metadataMetrics")
    public Map<String, String> metadataMetrics() {
        YamlMapFactoryBean yamlFactory = new YamlMapFactoryBean();
        yamlFactory.setResources(new ClassPathResource("application.yml"));
        return (Map<String, String>) yamlFactory.getObject().get("metadataMetrics");
    }

}
