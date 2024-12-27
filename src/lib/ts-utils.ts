type PickElsePartial<T extends object, PickedKeys extends keyof T> = Pick<T, PickedKeys> &
	Partial<T>;
