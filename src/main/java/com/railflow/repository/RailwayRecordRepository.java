package com.railflow.repository;

import com.railflow.model.RailwayRecord;

import java.util.List;
import java.util.Map;

/**
 * Repository interface for Indian Railways Empirical CSV Records stored in SQLite.
 */
public interface RailwayRecordRepository {
    
    long count();
    
    long countByCategory(String category);
    
    List<RailwayRecord> findPaginated(int page, int size, String category, String year, String search);
    
    List<String> findDistinctCategories();
    
    List<String> findDistinctYears();
    
    Map<String, Long> getCategorySummary();
    
    void batchInsert(List<RailwayRecord> records);
    
    void save(RailwayRecord record);
}
