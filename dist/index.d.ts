export declare type Parent = Element | DocumentFragment;
export declare type Listener = (e: Event) => void;
export declare type Setter = (el: Element) => void;
export declare type Factory = (props: Props, ...children: Child[]) => Parent;
export declare type Type = string | typeof DocumentFragment | Factory;
export declare type Ref = {
    current: null | Element;
};
export declare type PropValue = undefined | null | AttrValue | Listener | Setter | Ref;
export declare type Props = {
    [key: string]: PropValue;
};
export declare type AttrValue = string | number | boolean;
export declare type Child = Element | string | number | any | Child[];
export declare function createRef(el?: null | Element): Ref;
export declare function createEl(type: Type, props: Props, ...children: Child[]): Parent;
