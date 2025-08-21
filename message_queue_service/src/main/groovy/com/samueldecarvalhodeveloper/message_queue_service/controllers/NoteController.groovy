package com.samueldecarvalhodeveloper.message_queue_service.controllers

import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteRepository
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.NoteRepositoryFactory
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.entities.NoteEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.note.infrastructure.exceptions.AlreadyExistingNoteException
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.entities.UserEntity
import com.samueldecarvalhodeveloper.message_queue_service.domains.user.infrastructure.exceptions.NotExistingUserException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/notes")
class NoteController {
    @GetMapping("/{user_id}/")
    ResponseEntity<ArrayList<NoteEntity>> getAllNotes(@PathVariable("user_id") Integer userId) {
        try {
            NoteRepository noteRepository = NoteRepositoryFactory.getInstance()

            ArrayList<NoteEntity> notes = noteRepository.getNotes(userId)

            return new ResponseEntity<ArrayList<NoteEntity>>(notes, HttpStatus.OK)
        } catch (Exception ignored) {
            return new ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @GetMapping("/{user_id}/{id}/")
    ResponseEntity<NoteEntity> getNote(@PathVariable("user_id") Integer userId, @PathVariable("id") Integer id) {
        try {
            NoteRepository noteRepository = NoteRepositoryFactory.getInstance()

            NoteEntity note = noteRepository.getNote(id, userId)

            return new ResponseEntity<NoteEntity>(note, HttpStatus.OK)
        } catch (Exception ignored) {
            return new ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @PostMapping("/{user_id}/")
    ResponseEntity createNote(@RequestBody NoteEntity note) {
        try {
            NoteRepository noteRepository = NoteRepositoryFactory.getInstance()

            noteRepository.createNote(note)

            return new ResponseEntity<UserEntity>(HttpStatus.CREATED)
        } catch (NotExistingUserException ignored) {
            return new ResponseEntity(HttpStatus.NOT_FOUND)
        } catch (AlreadyExistingNoteException ignored) {
            return new ResponseEntity(HttpStatus.CONFLICT)
        }
    }

    @PatchMapping("{user_id}/{id}/")
    ResponseEntity updateNote(@RequestBody NoteEntity note) {
        try {
            NoteRepository noteRepository = NoteRepositoryFactory.getInstance()

            noteRepository.updateNote(note)

            return new ResponseEntity<UserEntity>(HttpStatus.OK)
        } catch (Exception ignored) {
            return new ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @DeleteMapping("{user_id}/{id}/")
    ResponseEntity deleteNote(@PathVariable("user_id") Integer userId, @PathVariable("id") Integer id) {
        try {
            NoteRepository noteRepository = NoteRepositoryFactory.getInstance()

            noteRepository.deleteNote(id, userId)

            return new ResponseEntity(HttpStatus.NO_CONTENT)
        } catch (Exception ignored) {
            return new ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }
}