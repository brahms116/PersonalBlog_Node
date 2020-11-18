export interface CollectionInput{
    opts:{
        size?:number
        cursor?:string
    }
}


export interface CollectionCreateData{
    cursor?:string,
    size?:number
}

export interface graphQLData{
    ref?:string
}

export interface CollectionResponse{
    after?:string[],
    before?:string[],
}