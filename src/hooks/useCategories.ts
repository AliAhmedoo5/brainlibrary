'use client';

import { useState, useEffect, useCallback } from 'react';
import { Category } from '@/types/category';
import { useAuth } from './useAuth';
import {
  getCategories,
  saveCategory as firestoreSaveCategory,
  deleteCategory as firestoreDeleteCategory,
  subscribeToChanges
} from '@/lib/firestore';

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    const uid = user?.uid || 'demo_user_001';
    try {
      const fetched = await getCategories(uid);
      setCategories(fetched);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCategories();
    const unsubscribe = subscribeToChanges(() => {
      fetchCategories();
    });
    return () => unsubscribe();
  }, [fetchCategories]);

  const saveCategory = async (category: Category) => {
    const uid = user?.uid || 'demo_user_001';
    await firestoreSaveCategory(uid, category);
  };

  const deleteCategory = async (categoryId: string) => {
    const uid = user?.uid || 'demo_user_001';
    await firestoreDeleteCategory(uid, categoryId);
  };

  return {
    categories,
    loading,
    saveCategory,
    deleteCategory,
    refreshCategories: fetchCategories
  };
}
