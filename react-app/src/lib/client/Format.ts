export interface Format {
    name: string;
    info: {
        title: string;
        shortTitle: string;
        homePage: string
    }
    mappings: {
        id: string;
        parent: string;
        name: string;
    },
    columns: Array<FormatColumn>
}

export interface FormatColumn {
    title: string;
    aliases: Array<string>;
    sampleKey: string;
}