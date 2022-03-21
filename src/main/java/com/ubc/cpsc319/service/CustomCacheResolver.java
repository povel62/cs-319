package com.ubc.cpsc319.service;

import com.ubc.cpsc319.entity.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.interceptor.CacheOperationInvocationContext;
import org.springframework.cache.interceptor.CacheResolver;
import org.springframework.cache.interceptor.SimpleKey;
import org.springframework.stereotype.Component;

import java.util.*;


import java.util.ArrayList;
import java.util.Collection;

@Component
public class CustomCacheResolver implements CacheResolver {

    private static final String CACHE_NAME = "emails";

    @Autowired
    private CacheManager cacheManager;

    @SuppressWarnings("unchecked")
    @Override
    public Collection<? extends Cache> resolveCaches(CacheOperationInvocationContext<?> cacheOperationInvocationContext) {

        String method = cacheOperationInvocationContext.getMethod().toString();
        //get the updated post
        Object[] args = cacheOperationInvocationContext.getArgs();
        Email post = (Email) args[0];
        boolean isDelete = (Boolean) args[1];


        //read the cache
        Cache cache = cacheManager.getCache(CACHE_NAME);

        //get the concurrent cache map in key-value pair
        assert cache != null;
        Map<SimpleKey, List<Email>> map = (Map<SimpleKey, List<Email>>) cache.getNativeCache();

        //Convert to set to iterate
        Set<Map.Entry<SimpleKey, List<Email>>> entrySet = map.entrySet();
        Iterator<Map.Entry<SimpleKey, List<Email>>> itr = entrySet.iterator();

        //if a iterated entry is a list then it is our desired data list!!! Yayyy
        Map.Entry<SimpleKey, List<Email>> entry = null;
        while (itr.hasNext()) {
            entry = itr.next();
            if (entry.getKey() instanceof SimpleKey) break;
        }

        //get the list
        assert entry != null;
        List<Email> postList = entry.getValue();


        //update it
        for (Email temp : postList) {
            assert post != null;
            if (temp.getId().equals(post.getId())) {
                postList.remove(temp);
                break;
            }
        }
        if (!isDelete) {
            postList.add(post);
        }

        //update the cache!! :D
        cache.put(entry.getKey(), postList);

        itr = entrySet.iterator();
        while (itr.hasNext()) {
            entry = itr.next();
            if (entry.getKey() instanceof SimpleKey) { } else {
                map.remove(entry.getKey());
            }
        }




        return new ArrayList<>(Collections.singletonList(cacheManager.getCache(CACHE_NAME)));
    }
}