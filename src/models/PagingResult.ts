export class PagingResult<T>{
    public rowCount: number = 0;
    public pageCount: number = 0;
    public rows: T[];
}
