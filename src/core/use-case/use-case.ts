export interface UseCase<Type, Params> {
    execute(params: Params): Type;
}
