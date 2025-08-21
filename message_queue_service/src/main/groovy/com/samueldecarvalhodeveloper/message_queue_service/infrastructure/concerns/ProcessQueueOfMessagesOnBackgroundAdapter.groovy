package com.samueldecarvalhodeveloper.message_queue_service.infrastructure.concerns

import com.samueldecarvalhodeveloper.message_queue_service.domains.background_thread_executer.BackgroundThreadExecutor
import com.samueldecarvalhodeveloper.message_queue_service.domains.event_queue.EventQueue

class ProcessQueueOfMessagesOnBackgroundAdapter {
    static void processQueueOfMessagesOnBackground() {
        BackgroundThreadExecutor.executeActionOnBackgroundThread {
            EventQueue.processQueue()
        }
    }
}
