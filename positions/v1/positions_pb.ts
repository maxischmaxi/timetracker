// @generated by protoc-gen-es v2.3.0 with parameter "target=ts"
// @generated from file positions/v1/positions.proto (package positions.v1, syntax proto3)
/* eslint-disable */

import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { enumDesc, fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import { file_org_v1_org } from "../../org/v1/org_pb";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file positions/v1/positions.proto.
 */
export const file_positions_v1_positions: GenFile = /*@__PURE__*/
  fileDesc("Chxwb3NpdGlvbnMvdjEvcG9zaXRpb25zLnByb3RvEgxwb3NpdGlvbnMudjEiQwoIRGlzY291bnQSKAoEdHlwZRgCIAEoDjIaLnBvc2l0aW9ucy52MS5EaXNjb3VudFR5cGUSDQoFdmFsdWUYAyABKAIiSQoOQ3JlYXRlRGlzY291bnQSKAoEdHlwZRgCIAEoDjIaLnBvc2l0aW9ucy52MS5EaXNjb3VudFR5cGUSDQoFdmFsdWUYAyABKAIidQoIUG9zaXRpb24SDAoEbmFtZRgCIAEoCRITCgtkZXNjcmlwdGlvbhgDIAEoCRINCgVjb3VudBgEIAEoBRINCgVwcmljZRgFIAEoAhIoCgR1bml0GAYgASgOMhoucG9zaXRpb25zLnYxLlBvc2l0aW9uVW5pdCKlAQoOQ3JlYXRlUG9zaXRpb24SDAoEbmFtZRgCIAEoCRITCgtkZXNjcmlwdGlvbhgDIAEoCRINCgVjb3VudBgEIAEoBRINCgVwcmljZRgFIAEoAhIoCgR1bml0GAYgASgOMhoucG9zaXRpb25zLnYxLlBvc2l0aW9uVW5pdBIoCghkaXNjb3VudBgHIAEoCzIWLnBvc2l0aW9ucy52MS5EaXNjb3VudCqeAwoMUG9zaXRpb25Vbml0Eh0KGVBPU0lUSU9OX1VOSVRfVU5TUEVDSUZJRUQQABIXChNQT1NJVElPTl9VTklUX1dFRUtTEAESGQoVUE9TSVRJT05fVU5JVF9NSU5VVEVTEAISGgoWUE9TSVRJT05fVU5JVF9QQVVTQ0hBTBADEhcKE1BPU0lUSU9OX1VOSVRfTklHSFQQBBIdChlQT1NJVElPTl9VTklUX1FVQklDX01FVEVSEAUSHwobUE9TSVRJT05fVU5JVF9RVUFEUkFUX01FVEVSEAYSFwoTUE9TSVRJT05fVU5JVF9NRVRFUhAHEhcKE1BPU0lUSU9OX1VOSVRfTElURVIQCBIUChBQT1NJVElPTl9VTklUX0tNEAkSHAoYUE9TSVRJT05fVU5JVF9DQVJEQk9BUkRTEAoSFwoTUE9TSVRJT05fVU5JVF9NT05USBALEhUKEVBPU0lUSU9OX1VOSVRfREFZEAwSFwoTUE9TSVRJT05fVU5JVF9QSUVDRRANEhcKE1BPU0lUSU9OX1VOSVRfSE9VUlMQDiphCgxEaXNjb3VudFR5cGUSHQoZRElTQ09VTlRfVFlQRV9VTlNQRUNJRklFRBAAEhkKFURJU0NPVU5UX1RZUEVfUEVSQ0VOVBABEhcKE0RJU0NPVU5UX1RZUEVfRklYRUQQAkI8WjpnaXRodWIuY29tL21heGlzY2htYXhpL2xqdGltZS1hcGkvcG9zaXRpb25zL3YxO3Bvc2l0aW9uc3YxYgZwcm90bzM", [file_org_v1_org]);

/**
 * @generated from message positions.v1.Discount
 */
export type Discount = Message<"positions.v1.Discount"> & {
  /**
   * @generated from field: positions.v1.DiscountType type = 2;
   */
  type: DiscountType;

  /**
   * @generated from field: float value = 3;
   */
  value: number;
};

/**
 * Describes the message positions.v1.Discount.
 * Use `create(DiscountSchema)` to create a new message.
 */
export const DiscountSchema: GenMessage<Discount> = /*@__PURE__*/
  messageDesc(file_positions_v1_positions, 0);

/**
 * @generated from message positions.v1.CreateDiscount
 */
export type CreateDiscount = Message<"positions.v1.CreateDiscount"> & {
  /**
   * @generated from field: positions.v1.DiscountType type = 2;
   */
  type: DiscountType;

  /**
   * @generated from field: float value = 3;
   */
  value: number;
};

/**
 * Describes the message positions.v1.CreateDiscount.
 * Use `create(CreateDiscountSchema)` to create a new message.
 */
export const CreateDiscountSchema: GenMessage<CreateDiscount> = /*@__PURE__*/
  messageDesc(file_positions_v1_positions, 1);

/**
 * @generated from message positions.v1.Position
 */
export type Position = Message<"positions.v1.Position"> & {
  /**
   * @generated from field: string name = 2;
   */
  name: string;

  /**
   * @generated from field: string description = 3;
   */
  description: string;

  /**
   * @generated from field: int32 count = 4;
   */
  count: number;

  /**
   * @generated from field: float price = 5;
   */
  price: number;

  /**
   * @generated from field: positions.v1.PositionUnit unit = 6;
   */
  unit: PositionUnit;
};

/**
 * Describes the message positions.v1.Position.
 * Use `create(PositionSchema)` to create a new message.
 */
export const PositionSchema: GenMessage<Position> = /*@__PURE__*/
  messageDesc(file_positions_v1_positions, 2);

/**
 * @generated from message positions.v1.CreatePosition
 */
export type CreatePosition = Message<"positions.v1.CreatePosition"> & {
  /**
   * @generated from field: string name = 2;
   */
  name: string;

  /**
   * @generated from field: string description = 3;
   */
  description: string;

  /**
   * @generated from field: int32 count = 4;
   */
  count: number;

  /**
   * @generated from field: float price = 5;
   */
  price: number;

  /**
   * @generated from field: positions.v1.PositionUnit unit = 6;
   */
  unit: PositionUnit;

  /**
   * @generated from field: positions.v1.Discount discount = 7;
   */
  discount?: Discount;
};

/**
 * Describes the message positions.v1.CreatePosition.
 * Use `create(CreatePositionSchema)` to create a new message.
 */
export const CreatePositionSchema: GenMessage<CreatePosition> = /*@__PURE__*/
  messageDesc(file_positions_v1_positions, 3);

/**
 * @generated from enum positions.v1.PositionUnit
 */
export enum PositionUnit {
  /**
   * @generated from enum value: POSITION_UNIT_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * @generated from enum value: POSITION_UNIT_WEEKS = 1;
   */
  WEEKS = 1,

  /**
   * @generated from enum value: POSITION_UNIT_MINUTES = 2;
   */
  MINUTES = 2,

  /**
   * @generated from enum value: POSITION_UNIT_PAUSCHAL = 3;
   */
  PAUSCHAL = 3,

  /**
   * @generated from enum value: POSITION_UNIT_NIGHT = 4;
   */
  NIGHT = 4,

  /**
   * @generated from enum value: POSITION_UNIT_QUBIC_METER = 5;
   */
  QUBIC_METER = 5,

  /**
   * @generated from enum value: POSITION_UNIT_QUADRAT_METER = 6;
   */
  QUADRAT_METER = 6,

  /**
   * @generated from enum value: POSITION_UNIT_METER = 7;
   */
  METER = 7,

  /**
   * @generated from enum value: POSITION_UNIT_LITER = 8;
   */
  LITER = 8,

  /**
   * @generated from enum value: POSITION_UNIT_KM = 9;
   */
  KM = 9,

  /**
   * @generated from enum value: POSITION_UNIT_CARDBOARDS = 10;
   */
  CARDBOARDS = 10,

  /**
   * @generated from enum value: POSITION_UNIT_MONTH = 11;
   */
  MONTH = 11,

  /**
   * @generated from enum value: POSITION_UNIT_DAY = 12;
   */
  DAY = 12,

  /**
   * @generated from enum value: POSITION_UNIT_PIECE = 13;
   */
  PIECE = 13,

  /**
   * @generated from enum value: POSITION_UNIT_HOURS = 14;
   */
  HOURS = 14,
}

/**
 * Describes the enum positions.v1.PositionUnit.
 */
export const PositionUnitSchema: GenEnum<PositionUnit> = /*@__PURE__*/
  enumDesc(file_positions_v1_positions, 0);

/**
 * @generated from enum positions.v1.DiscountType
 */
export enum DiscountType {
  /**
   * @generated from enum value: DISCOUNT_TYPE_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * @generated from enum value: DISCOUNT_TYPE_PERCENT = 1;
   */
  PERCENT = 1,

  /**
   * @generated from enum value: DISCOUNT_TYPE_FIXED = 2;
   */
  FIXED = 2,
}

/**
 * Describes the enum positions.v1.DiscountType.
 */
export const DiscountTypeSchema: GenEnum<DiscountType> = /*@__PURE__*/
  enumDesc(file_positions_v1_positions, 1);

