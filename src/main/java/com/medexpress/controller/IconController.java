package com.medexpress.controller;

import org.springframework.web.bind.annotation.RestController;

import com.medexpress.service.IconService;
import com.medexpress.validator.UserValidator;

import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.medexpress.entity.Icon;

@RestController
@RequestMapping("/api/v1/icon")
public class IconController {

    @Autowired
    private final IconService iconService;

    public IconController(IconService iconService) {
        this.iconService = iconService;
    }

    // get icon by type
    @GetMapping()
    public Icon getIconByType(@RequestParam String type) {
        return iconService.findByType(type);
    }

    // post name and type and create icon
    @PostMapping()
    public ResponseEntity<Icon> createIcon(@RequestBody Map<String, String> body) {
        Icon icon = iconService.createIcon(body.get("name"), body.get("type"), body.get("color"));
        return new ResponseEntity<>(icon, HttpStatus.CREATED);
    }

    // get all icons
    @GetMapping("/all")
    public List<Icon> getAllIcons() {
        return iconService.findAll();
    }

}
