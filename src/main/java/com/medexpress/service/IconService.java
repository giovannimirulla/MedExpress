package com.medexpress.service;

import com.medexpress.repository.IconRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.medexpress.entity.Icon;

@Service
public class IconService {

    @Autowired
    private IconRepository iconRepository;

    // findByType
    public Icon findByType(String type) {
        return iconRepository.findByType(type);
    }

    public List<Icon> findAll() {

        return iconRepository.findAll();

    }

    public Icon createIcon(String name, String type, String color) {
        Icon icon = iconRepository.insert(new Icon(name, type, color));
        return icon;
    }

}