export default interface Action {
    name: string,
    action: Function,
    cost: number,
    color: string,
    disabled: boolean,
}