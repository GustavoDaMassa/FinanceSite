import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { CategoryDTO, CategoryInput } from '../../shared/models';
import {
  LIST_CATEGORIES_BY_USER,
  FIND_CATEGORY_BY_ID,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from '../../shared/graphql/category.operations';

/**
 * CategoriesService — CRUD de categorias via Apollo.
 */
@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly apollo = inject(Apollo);

  listByUser(userId: string): Observable<CategoryDTO[]> {
    return this.apollo
      .watchQuery<{ listCategoriesByUser: CategoryDTO[] }>({
        query: LIST_CATEGORIES_BY_USER,
        variables: { userId },
      })
      .valueChanges.pipe(map((r) => r.data.listCategoriesByUser));
  }

  findById(id: string): Observable<CategoryDTO> {
    return this.apollo
      .query<{ findCategoryById: CategoryDTO }>({
        query: FIND_CATEGORY_BY_ID,
        variables: { id },
      })
      .pipe(map((r) => r.data.findCategoryById));
  }

  create(input: CategoryInput): Observable<CategoryDTO> {
    return this.apollo
      .mutate<{ createCategory: CategoryDTO }>({
        mutation: CREATE_CATEGORY,
        variables: { input },
      })
      .pipe(map((r) => r.data!.createCategory));
  }

  update(id: string, input: CategoryInput): Observable<CategoryDTO> {
    return this.apollo
      .mutate<{ updateCategory: CategoryDTO }>({
        mutation: UPDATE_CATEGORY,
        variables: { id, input },
      })
      .pipe(map((r) => r.data!.updateCategory));
  }

  delete(id: string): Observable<CategoryDTO> {
    return this.apollo
      .mutate<{ deleteCategory: CategoryDTO }>({
        mutation: DELETE_CATEGORY,
        variables: { id },
      })
      .pipe(map((r) => r.data!.deleteCategory));
  }
}
