package com.railflow.collection;

import com.railflow.model.Station;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Dedicated in-memory registry for Station entities.
 */
@Component
public class StationRegistry extends DataRegistry<String, Station> {

    public void save(Station s) {
        if (s != null) {
            put(s.getCode(), s);
        }
    }

    public Optional<Station> findByCode(String code) {
        return get(code);
    }

    public List<Station> findByZone(String zone) {
        return filter(s -> s.getZone() != null && s.getZone().equalsIgnoreCase(zone));
    }
}
