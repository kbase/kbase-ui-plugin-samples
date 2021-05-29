export interface Format {
    name: string;
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