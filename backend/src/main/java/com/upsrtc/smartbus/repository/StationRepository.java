package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface StationRepository extends JpaRepository<Station, Integer> {
    List<Station> findByRegionId(Integer regionId);
    List<Station> findByNameIgnoreCase(String name);

    @Query("SELECT s FROM Station s LEFT JOIN s.region r LEFT JOIN s.depot d " +
           "WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Station> searchStations(@Param("query") String query);
}

