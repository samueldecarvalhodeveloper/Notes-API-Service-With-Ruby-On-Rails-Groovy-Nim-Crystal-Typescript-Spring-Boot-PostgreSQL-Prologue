package com.samueldecarvalhodeveloper.message_queue_service.controllers

import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserRepository
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.UserRepositoryFactory
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/users")
class UserController {
    @GetMapping("/")
    ResponseEntity<ArrayList<UserEntity>> getAllUsers() {
        UserRepository userRepository = UserRepositoryFactory.getInstance()

        ArrayList<UserEntity> users = userRepository.getUsers()

        return new ResponseEntity<ArrayList<UserEntity>>(users, HttpStatus.OK)
    }

    @GetMapping("/{id}/")
    ResponseEntity<UserEntity> getUser(@PathVariable("id") Integer id) {
        try {
            UserRepository userRepository = UserRepositoryFactory.getInstance()

            UserEntity users = userRepository.getUser(id)

            return new ResponseEntity<UserEntity>(users, HttpStatus.OK)
        } catch (Exception ignored) {
            return new ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @PostMapping("/")
    ResponseEntity createUser(@RequestBody UserEntity user) {
        try {
            UserRepository userRepository = UserRepositoryFactory.getInstance()

            userRepository.createUser(user)

            return new ResponseEntity(HttpStatus.CREATED)
        } catch (Exception ignored) {
            return new ResponseEntity(HttpStatus.CONFLICT)
        }
    }

    @PatchMapping("/{id}/")
    ResponseEntity updateUser(@RequestBody UserEntity user) {
        try {
            UserRepository userRepository = UserRepositoryFactory.getInstance()

            userRepository.updateUser(user)

            return new ResponseEntity(HttpStatus.OK)
        } catch (Exception ignored) {
            return new ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @DeleteMapping("/{id}/")
    ResponseEntity deleteUser(@PathVariable("id") Integer id) {
        try {
            UserRepository userRepository = UserRepositoryFactory.getInstance()

            userRepository.deleteUser(id)

            return new ResponseEntity(HttpStatus.NO_CONTENT)
        } catch (Exception ignored) {
            return new ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }
}