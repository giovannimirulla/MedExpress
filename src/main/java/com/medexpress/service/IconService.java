package com.medexpress.service;

import com.medexpress.repository.IconRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;

import com.medexpress.entity.Icon;

@Service
public class IconService {

    @Autowired
    private IconRepository iconRepository;

    public Icon findByTypeRegex(String type) {
        String cleanedType = type.replaceAll("[.,]", "");
        String[] words = cleanedType.split(" ");
        String regex = String.join("|", words);
        Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
        List<Icon> icons = iconRepository.findByTypeRegex(pattern);
        if (icons.size() > 0) {
            return icons.get(0);
        }
        return null;

    }

    public List<Icon> findAll() {

        return iconRepository.findAll();

    }

    public Icon createIcon(String name, String type, String color) {
        Icon icon = iconRepository.insert(new Icon(name, type, color));
        return icon;
    }

}