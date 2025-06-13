/*
Author: Phu Vo (vovanphu1012@gmail.com)
get-relation-api-name.ts (c) 2025
*/

import { upperCaseFirstLetter } from './upper-case-first-letter';

export function getSetRelationApiName(
  relationName: string,
  entityName: string,
): string {
  return `set${upperCaseFirstLetter(relationName)}For${entityName}`;
}

export function getAddRelationApiName(
  relationName: string,
  entityName: string,
): string {
  return `add${upperCaseFirstLetter(relationName)}For${entityName}`;
}

export function getRemoveRelationApiName(
  relationName: string,
  entityName: string,
): string {
  return `remove${upperCaseFirstLetter(relationName)}For${entityName}`;
}

export function getFindRelationApiName(
  relationName: string,
  entityName: string,
): string {
  return `find${upperCaseFirstLetter(relationName)}For${entityName}`;
}
