package com.samueldecarvalhodeveloper.message_queue_service.domains.background_thread_executer

class BackgroundThreadExecutor {
    private BackgroundThreadExecutor() {}

    static void executeActionOnBackgroundThread(Closure<Void> action) {
        Thread backgroundThread = new Thread(new Runnable() {
            @Override
            void run() {
                action()
            }
        })

        backgroundThread.start()
    }
}
