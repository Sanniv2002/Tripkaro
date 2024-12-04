import { atom } from "recoil";

export const tripsAtom = atom<any>({
    key: 'tripsAtom',
    default: []
})