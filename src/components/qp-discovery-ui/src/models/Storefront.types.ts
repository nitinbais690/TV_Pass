export interface CatalogDataResponse {
    header: Header;
    data: Container[];
}

export interface MetaDataResponse {
    header: Header;
    data: Data;
}
export interface DataStoreResponse {
    header: Header;
    data: Data;
}
export interface ResourceResponse {
    header: Header;
    data: Data[];
}

export interface EpgProgramResponse {
    header: Header;
    data: ProgramData;
}

export interface StorefrontTabResponse {
    header: Header;
    data: Tab[];
}

export interface EpgResponse {
    header: Header;
    data: Channel[];
}

export interface Channel {
    airings: Airing[];
    cId: string;
    cs: string;
    im: Im;
}

export interface Airing {
    cId: string;
    cty: string;
    d: number;
    et: any;
    id: string;
    p: P;
    st: any;
    sId: string;
}

export interface P {
    ety: string;
    g: string[];
    id: string;
    im: Im;
    serId: string;
    sty: string;
    t: string;
    tl: string;
    en?: number;
    ept: string;
    sn?: number;
}

export interface Im {
    c: string;
    h: string;
    u: string;
    w: string;
}

export type StorefrontStatus = 'published' | 'draft';

export interface Tab {
    id: string;
    lon: LocalizedName[];
}

export interface Container {
    cd: Resource[];
    lon: LocalizedName[];
    n: string;
    id: string;
    lo: string;
    iar: string;
    stl: string;
    s: string;
    u: string;
    sa: boolean;
    src?: string;
    lang: Lang;
    ed_dt: Date;
    i: Items[];
    st_dt: Date;
    urn: string;
}

export interface Resource {
    cty: Category;
    ia: string[];
    i: string;
    id: string;
    key: string;
    lon: LocalizedField<string>[];
    c_lo: string;
    ct: Date;
    ad?: string;
    ed_dt: Date;
    n: string;
    st: string;
    st_dt: Date;
    ty: string;
    urn: string;
    ut: Date;
    c?: Container[];
    a_id?: number;
    cast?: string[];
    director?: string[];
    ex_ia?: DataStoreImage[];
    ex_id?: string;
    log: LocalizedField<string[]>[];
    keywords?: string[] | null;
    lod?: LocalizedField<string>[];
    lold?: LocalizedField<string>[];
    bgc?: string;
    pn?: string;
    net?: string;
    r?: number;
    r_dt?: Date;
    rat?: Rating[];
    rt?: number;
    epnum?: number;
    ex_sid?: string;
    oa_dt?: Date;
    setl_id?: string;
    snum?: number;
    lostl: LocalizedField<string>[];
    stl_id?: string;
    sc?: number;
    cs?: string;
    cre?: number;
}

export enum Category {
    Movie = 'movie',
    TVSeries = 'tvseries',
    TVEpisode = 'tvepisode',
    TVSeason = 'tvseason',
    Short = 'shortvideo',
}

export enum AspectRatio {
    The16By9 = '16by9',
    The1By1 = '1by1',
    The2By3 = '2by3',
}

export interface Urn {
    const: string;
    title: string;
}

export interface R {
    b: string;
    c: string;
}

export interface ProgramData {
    cty: string;
    desl: string;
    ety: string;
    g: string[];
    id: string;
    im: Im;
    ldes: string;
    r: R[];
    sdes: string;
    serId: string;
    sty: string;
    t: string;
    tl: string;
    ry?: number;
    sn?: number;
}

export interface Data {
    ct: Date;
    c?: Container[];
    ty: string;
    bgc?: string;
    c_lo: string;
    ed_dt?: Date;
    id: string;
    ad?: string;
    key: string;
    st: string;
    st_dt?: Date;
    urn: string;
    ut: Date;
    keys: string[];
    keyLookupURL: string;
    a_id: number;
    cast: string[];
    categories: string[];
    cc?: string;
    cty: Category;
    dpu?: string;
    dwu?: string;
    ex_id?: string;
    log: LocalizedField<string[]>[];
    hfu: string;
    ia: string[];
    i?: string;
    lod: LocalizedField<string>[];
    lon: LocalizedField<string>[];
    pkg_id: string;
    pn: string;
    net?: string;
    r?: number;
    rat: Rating[];
    rt?: number;
    d?: number;
    en_ca_t?: string;
    en_ca_t1?: string;
    en_ca_te?: string;
    episodes?: string[];
    seasons?: string[];
    epnum?: number;
    setl?: string;
    snum?: number;
    stl: string;
    lostl: LocalizedField<string>[];
    stl_id?: string;
    sd_dt?: Date;
    status?: string;
    director: string[];
    images: string[];
    keywords: string[];
    lold: LocalizedField<string>[];
    ex_ia: DataStoreImage[];
    oa_dt: Date;
    r_dt: Date;
    sc: number;
    ex_sid: string;
    setl_id: string;
    cre?: number;
}
export interface Items {
    count?: number;
    cu?: string;
    id: string;
    q?: string;
    type?: string;
    urn: string;
}
export interface Episodes {
    fieldType: string;
    id: string;
    keys: string[];
    queryOnType: string;
    urn: string;
}
export interface Rating {
    s: string;
    v: string;
}

export enum Lo {
    Banner = 'banner',
    Carousal = 'carousal',
}

export enum S {
    Large = 'large',
    Regular = 'regular',
}

export enum Stl {
    Regular = 'regular',
    Rounded = 'rounded',
}

export interface LocalizedField<T> {
    lang: string;
    n: T;
}

export interface LocalizedName {
    lang: string;
    n: string;
}

export interface LocalizedGenre {
    lang: string;
    n: string[];
}

export interface Header {
    source: string;
    code: string;
    message: string;
    systemtime: number;
    count: number;
    rows: number;
    start: number;
}
export interface Cast {
    fn: string;
    id: string;
    ln: string;
    role: string;
    urn: string;
}

export interface DataStoreImage {
    key: string;
    url: string;
}

export enum ImageAsset {
    poster16x9 = '0-16x9',
    poster1X1 = '0-1x1',
    poster2X3 = '0-2x3',
    poster4X3 = '0-4x3',
    cover16X9 = '1-16x9',
    cover2X3 = '1-2x3',
    banner16X9 = '2-16x9',
}

export enum Keyword {
    Comedy = 'comedy',
    Science = 'Science',
}
export interface LocalizedDescription extends LocalizedName {}

export enum Lang {
    En = 'en',
    Ta = 'ta',
}

export enum St {
    Archived = 'archived',
    Draft = 'draft',
    Published = 'published',
}
