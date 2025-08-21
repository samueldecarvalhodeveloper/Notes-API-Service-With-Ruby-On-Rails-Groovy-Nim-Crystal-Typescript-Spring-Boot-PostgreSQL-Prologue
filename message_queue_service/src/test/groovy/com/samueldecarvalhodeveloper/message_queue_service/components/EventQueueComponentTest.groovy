package com.samueldecarvalhodeveloper.message_queue_service.components

import com.samueldecarvalhodeveloper.message_queue_service.domains.background_thread_executer.BackgroundThreadExecutor
import com.samueldecarvalhodeveloper.message_queue_service.domains.event_queue.EventQueue
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

import java.lang.reflect.Field

import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.EventQueueConstants.getLONGER_QUEUE_PROCESSING_LOOP_INTERVAL
import static com.samueldecarvalhodeveloper.message_queue_service.constants.domains.EventQueueConstants.getQUEUE_OF_EVENTS_CLASS_ATTRIBUTE
import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class EventQueueComponentTest {
    @Test
    void testAddingEventToQueue() {
        Integer numberToBeChanged = Integer.MIN_VALUE

        EventQueue.addEvent({
            numberToBeChanged = Integer.MAX_VALUE
        } as Closure<Void>)

        Field queueOfEventsClassAttribute = EventQueue.getDeclaredField(QUEUE_OF_EVENTS_CLASS_ATTRIBUTE)

        queueOfEventsClassAttribute.setAccessible(true)

        Closure<Void> addedEvent = (queueOfEventsClassAttribute.get(null) as LinkedList<Closure<Void>>).get(0)

        addedEvent()

        assertThat(numberToBeChanged).isEqualTo(Integer.MAX_VALUE)
    }

    @Test
    void testExecutingAllOnlineAddedEvents() {
        Integer numberToBeChanged = Integer.MIN_VALUE

        Field queueOfEventsClassAttribute = EventQueue.getDeclaredField(QUEUE_OF_EVENTS_CLASS_ATTRIBUTE)

        queueOfEventsClassAttribute.setAccessible(true)

        (queueOfEventsClassAttribute.get(null) as LinkedList<Closure<Void>>).add({
            numberToBeChanged = Integer.MAX_VALUE
        } as Closure<Void>)

        BackgroundThreadExecutor.executeActionOnBackgroundThread {
            EventQueue.processQueue()
        }

        sleep(LONGER_QUEUE_PROCESSING_LOOP_INTERVAL)

        assertThat((queueOfEventsClassAttribute.get(null) as LinkedList<Closure<Void>>).size()).isEqualTo(0)
        assertThat(numberToBeChanged).isEqualTo(Integer.MAX_VALUE)
    }
}
