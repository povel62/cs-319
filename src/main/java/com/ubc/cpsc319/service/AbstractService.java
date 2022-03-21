package com.ubc.cpsc319.service;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface AbstractService<T> {

    public CrudRepository getRepository();

    default List<T> findAll()
    {
        return (List<T>) getRepository().findAll();
    }

    default T find(Long id)
    {
        return (T) getRepository().findById(id).get();
    }

    default T save(T object)
    {
        return (T) getRepository().save(object);
    }

    default List<T> saveAll(List<T> objects)
    {
        return (List<T>) getRepository().saveAll(objects);
    }

    @SuppressWarnings("unchecked")
    default void delete(T object)
    {
        getRepository().delete(object);
    }

    @SuppressWarnings("unchecked")
    default void delete(Long id)
    {
        getRepository().delete(id);
    }

    @SuppressWarnings("unchecked")
    default void deleteAll(List<T> objects)
    {
        getRepository().deleteAll(objects);
    }
}
