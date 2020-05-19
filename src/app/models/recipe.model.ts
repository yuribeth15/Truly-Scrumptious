// this model allows me to have a specific schema of my recipes data
export class Recipe {
    constructor(
       public id: string,
       public category: string,
       public description: string,
       public title: string,
       public utencils: string[],
       public ingridients: string[],
       public method: string[],
       public imageUrl: string,
       public prepTime: number,
       public bakingTime: number,
       public  restTime: number,
       public level: string
    ) {}

}
