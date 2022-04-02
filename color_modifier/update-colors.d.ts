import {Color} from 'color'

declare module 'color' {
    interface Color<ColorParam> extends Color<ColorParam> {
        map(f:(color: Color<ColorParam>)=>Color<ColorParam>): Color<ColorParam>
    }
}
