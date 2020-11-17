

const re = /(\d+)(?=\"\))/g


export default function ReftoId(ref:string){
     // console.log(ref)
     return ref.match(re)![0]
}