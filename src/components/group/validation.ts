import * as Joi from 'joi';

import { validator } from '../../shared/validator';
import { Permission } from './type';

const groupSchema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array<Permission>().items(
    Joi.string().valid('READ'),
    Joi.string().valid('WRITE'),
    Joi.string().valid('DELETE'),
    Joi.string().valid('SHARE'),
    Joi.string().valid('UPLOAD_FILES')
  ),
});

const groupIdSchema = Joi.object({
  id: Joi.string().required(),
});

export const updateValidation = [
  validator.params(groupIdSchema),
  validator.body(groupSchema),
];

export const createValidation = [validator.body(groupSchema)];

export const deleteValidation = [validator.params(groupIdSchema)];

export const getByIdValidation = [validator.params(groupIdSchema)];
