package com.railflow.repository;

import com.railflow.model.PnrRecord;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for IRCTC PNR records stored in SQLite.
 */
public interface PnrRepository {
    
    Optional<PnrRecord> findByPnr(String pnr);
    
    PnrRecord save(PnrRecord record);
    
    List<PnrRecord> findRecent(int limit);
    
    long count();
    
    boolean existsByPnr(String pnr);
}
