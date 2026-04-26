package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.Depot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepotRepository extends JpaRepository<Depot, Integer> {
    List<Depot> findByRegionId(Integer regionId);
}

