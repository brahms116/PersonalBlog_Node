export interface CollectionInput{
    input:{
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