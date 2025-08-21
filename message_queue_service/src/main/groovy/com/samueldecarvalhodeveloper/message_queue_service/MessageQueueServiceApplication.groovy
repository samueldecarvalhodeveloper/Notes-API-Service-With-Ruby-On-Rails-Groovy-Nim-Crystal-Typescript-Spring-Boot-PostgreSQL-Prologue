package com.samueldecarvalhodeveloper.message_queue_service

import com.samueldecarvalhodeveloper.message_queue_service.infrastructure.concerns.ProcessQueueOfMessagesOnBackgroundAdapter
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication

@SpringBootApplication
class MessageQueueServiceApplication {
    static void main(String[] args) {
        ProcessQueueOfMessagesOnBackgroundAdapter.processQueueOfMessagesOnBackground()

        SpringApplication.run(MessageQueueServiceApplication, args)
    }
}
