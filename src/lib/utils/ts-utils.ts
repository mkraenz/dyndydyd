type PickElsePartial<T extends object, PickedKeys extends keyof T> = Pick<T, PickedKeys> &
	Partial<T>;

type PickedPartial<T extends object, PartialKeys extends keyof T> = Partial<Pick<T, PartialKeys>> &
	Omit<T, PartialKeys>;

type WithPartialId<T extends { id: string }> = PickedPartial<T, 'id'>;
