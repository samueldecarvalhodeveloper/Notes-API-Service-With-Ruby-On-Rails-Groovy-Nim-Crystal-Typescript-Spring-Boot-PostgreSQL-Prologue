package com.samueldecarvalhodeveloper.message_queue_service.unitaries.domains.background_thread_executer

import com.samueldecarvalhodeveloper.message_queue_service.constants.domains.EventQueueConstants
import com.samueldecarvalhodeveloper.message_queue_service.domains.background_thread_executer.BackgroundThreadExecutor
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

import static org.assertj.core.api.Assertions.assertThat

@SpringBootTest
class BackgroundThreadExecutorComponentTest {
    @Test
    void testExecutingActionOnABackgroundThread() {
        Integer numberToBeChanged = Integer.MIN_VALUE

        BackgroundThreadExecutor.executeActionOnBackgroundThread({
            sleep(EventQueueConstants.QUEUE_PROCESSING_LOOP_INTERVAL)

            numberToBeChanged = Integer.MAX_VALUE
        } as Closure<Void>)

        sleep(EventQueueConstants.LONGER_QUEUE_PROCESSING_LOOP_INTERVAL)

        assertThat(numberToBeChanged).isEqualTo(Integer.MAX_VALUE)
    }
}
