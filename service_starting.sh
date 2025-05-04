docker compose build in_memory_cache_database --no-cache
docker compose up in_memory_cache_database -d

docker compose build data_source_database --no-cache
docker compose up data_source_database -d

docker compose build in_memory_cache_service --no-cache
docker compose up in_memory_cache_service -d

docker compose build data_source_service --no-cache
docker compose up data_source_service -d

docker compose build message_queue_service --no-cache
docker compose up message_queue_service -d

docker compose build first_notes_api_service --no-cache
docker compose up first_notes_api_service -d

docker compose build second_notes_api_service --no-cache
docker compose up second_notes_api_service -d

docker compose build third_notes_api_service --no-cache
docker compose up third_notes_api_service -d

docker compose build load_balancing_proxy_service --no-cache
docker compose up load_balancing_proxy_service -d
