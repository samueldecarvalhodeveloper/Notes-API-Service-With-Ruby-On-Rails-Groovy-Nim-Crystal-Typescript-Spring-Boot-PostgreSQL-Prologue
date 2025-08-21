package com.samueldecarvalhodeveloper.message_queue_service.domains.event_queue


import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.EventQueueConstants.QUEUE_PROCESSING_LOOP_INTERVAL

class EventQueue {
    private static LinkedList<Closure<Void>> queueOfEvents = new LinkedList<Closure<Void>>()

    private EventQueue() {}

    static void addEvent(Closure<Void> event) {
        queueOfEvents.add(event)
    }

    static void processQueue() {
        while (true) {
            while (!queueOfEvents.isEmpty()) {
                Closure<Void> currentEvent = queueOfEvents.poll()

                if (!currentEvent.is(null)) {
                    currentEvent()
                }
            }

            sleep(QUEUE_PROCESSING_LOOP_INTERVAL)
        }
    }
}
