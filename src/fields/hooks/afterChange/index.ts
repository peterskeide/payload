import { SanitizedCollectionConfig } from '../../../collections/config/types';
import { SanitizedGlobalConfig } from '../../../globals/config/types';
import { PayloadRequest, RequestContext } from '../../../express/types';
import { traverseFields } from './traverseFields';
import deepCopyObject from '../../../utilities/deepCopyObject';

type Args<T> = {
  data: T | Record<string, unknown>
  doc: T | Record<string, unknown>
  previousDoc: T | Record<string, unknown>
  entityConfig: SanitizedCollectionConfig | SanitizedGlobalConfig
  operation: 'create' | 'update'
  req: PayloadRequest
  context: RequestContext
}

export const afterChange = async <T extends Record<string, unknown>>({
  data,
  doc: incomingDoc,
  previousDoc,
  entityConfig,
  operation,
  req,
  context,
}: Args<T>): Promise<T> => {
  const doc = deepCopyObject(incomingDoc);

  await traverseFields({
    data,
    doc,
    previousDoc,
    fields: entityConfig.fields,
    operation,
    req,
    previousSiblingDoc: previousDoc,
    siblingDoc: doc,
    siblingData: data,
    context,
  });

  return doc;
};
