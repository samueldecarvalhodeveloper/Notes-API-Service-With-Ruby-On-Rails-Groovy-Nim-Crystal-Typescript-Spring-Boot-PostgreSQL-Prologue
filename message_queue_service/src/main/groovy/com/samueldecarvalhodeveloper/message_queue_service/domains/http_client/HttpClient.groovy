package com.samueldecarvalhodeveloper.message_queue_service.domains.http_client

import com.samueldecarvalhodeveloper.message_queue_service.constants.domains.HttpClientConstants
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.http_client.infrastructure.entities.ResponseWithoutBodyEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.json_parser.JsonParser
import de.svenkubiak.http.Http
import de.svenkubiak.http.Result

class HttpClient {
    private HttpClient() {}

    static <T> ResponseEntity<T> getGetRequestResponse(String url, Class<T> responseBodyType) {
        Result requestResponse = Http.get(url).send()

        T parsedBodyFromRequestResponse = JsonParser.getObjectFromJsonString(
                requestResponse.body(),
                responseBodyType
        )

        ResponseEntity<T> response = ResponseEntityFactory.getInstance(
                requestResponse.status(),
                parsedBodyFromRequestResponse
        )

        return response
    }

    static <T> ResponseWithoutBodyEntity getPostRequestResponse(String url, T body) {
        String jsonStringOfBody = JsonParser.getJsonStringOfObject(body)

        Result requestResponse = Http.post(url)
                .withHeader(
                        HttpClientConstants.HTTP_REQUEST_JSON_CONTENT_TYPE_HEADER_KEY,
                        HttpClientConstants.HTTP_REQUEST_JSON_CONTENT_TYPE_HEADER_VALUE
                )
                .withBody(jsonStringOfBody)
                .send()

        ResponseWithoutBodyEntity response = ResponseWithoutBodyEntityFactory.getInstance(
                requestResponse.status()
        )

        return response
    }

    static <T> ResponseWithoutBodyEntity getPatchRequestResponse(String url, T body) {
        String jsonStringOfBody = JsonParser.getJsonStringOfObject(body)

        Result requestResponse = Http.patch(url)
                .withHeader(
                        HttpClientConstants.HTTP_REQUEST_JSON_CONTENT_TYPE_HEADER_KEY,
                        HttpClientConstants.HTTP_REQUEST_JSON_CONTENT_TYPE_HEADER_VALUE
                )
                .withBody(jsonStringOfBody)
                .send()

        ResponseWithoutBodyEntity response = ResponseWithoutBodyEntityFactory.getInstance(
                requestResponse.status()
        )

        return response
    }

    static ResponseWithoutBodyEntity getDeleteRequestResponse(String url) {
        Result requestResponse = Http.delete(url).send()

        ResponseWithoutBodyEntity response = ResponseWithoutBodyEntityFactory.getInstance(
                requestResponse.status()
        )

        return response
    }
}
