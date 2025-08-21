package com.samueldecarvalhodeveloper.message_queue_service.unitaries.infrastructure.concerns

import com.samueldecarvalhodeveloper.message_queue_service.constants.domains.EventQueueConstants
import com.samueldecarvalhodeveloper.message_queue_service.domains.event_queue.EventQueue
import com.samueldecarvalhodeveloper.message_queue_service.infrastructure.concerns.ProcessQueueOfMessagesOnBackgroundAdapter
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class ProcessQueueOfMessagesOnBackgroundAdapterTest {
    @Test
    void testIfMethodProcessQueueOfMessagesOnBackgroundExecutesOnABackgroundThreadMessageQueueProcessing() {
        Integer numberToBeChanged = Integer.MIN_VALUE

        EventQueue.addEvent({
            numberToBeChanged = Integer.MAX_VALUE
        } as Closure<Void>)

        ProcessQueueOfMessagesOnBackgroundAdapter.processQueueOfMessagesOnBackground()

        sleep(EventQueueConstants.LONGER_QUEUE_PROCESSING_LOOP_INTERVAL)

        assertThat(numberToBeChanged).isEqualTo(Integer.MAX_VALUE)
    }
}
