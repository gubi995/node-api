import * as Joi from 'joi';

import { validator } from '../../shared/validator';

export const passwordValidation = Joi.string()
  .required()
  .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/);

export const usernameValidation = Joi.string().required();

const ageValidation = Joi.number().required().min(4).max(130);

const isDeletedValidation = Joi.boolean();

const idValidation = Joi.string().uuid().required();

const userAutoSuggestionSchema = Joi.object({
  username: usernameValidation,
  limit: Joi.number().required(),
});

export const userSchema = Joi.object({
  username: usernameValidation,
  password: passwordValidation,
  age: ageValidation,
  isDeleted: isDeletedValidation,
});

const userIdSchema = Joi.object({
  id: idValidation,
});

export const updateValidation = [
  validator.params(userIdSchema),
  validator.body(userSchema),
];

export const createValidation = [validator.body(userSchema)];

export const deleteValidation = [validator.params(userIdSchema)];

export const getByIdValidation = [validator.params(userIdSchema)];

export const getAutoSuggestUsersValidation = [
  validator.query(userAutoSuggestionSchema),
];
