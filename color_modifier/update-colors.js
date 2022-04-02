import { list } from 'recursive-readdir-async';
import editFile from 'edit-file'
import color from 'color'
import * as fs from 'fs'


color.prototype.map = function(f){    
    return f(this)
}

const lerp = (a,b,alpha) => a*alpha+b*(1-alpha)
const g = x=> (1-Math.cos(Math.PI*x))/2
const g2 = x=>2*x-g(x)
const hue_func = (hue) => hue>90 && hue<330 ? hue : ((((hue+30)%360)/120)*240)+90


function updateFile(oldPath, newPath) {
    const fileContent = fs.readFileSync(oldPath).toString()
    const newFileContent = fileContent.replaceAll(
        /(#(?:[0-9a-f]{2}){2,4}|#[0-9a-f]{3}|(?:rgba?|hsla?)\((?:\d+%?(?:deg|rad|grad|turn)?(?:,|\s)+){2,3}[\s\/]*[\d\.]+%?\))/gi,
            x=>{
                const oc = color(x)
                const oc_negrot = oc.negate()
                                    .rotate(180)
                const final_color = oc_negrot.map(c=>c.lightness(((c.lightness()/100)**0.4)*100).value(((c.lightness()/100)**0.4)*100))
                .map(c=>c.hue(lerp(180, c.hue(),((Math.abs(c.hue()-180)/180)**10)/2)))
                .map(c=>c.value((x=>g2(g2(x)))(c.value()/100)*100))
                .saturate(2)
                .map(c=>{
                    const c2 = c.lightness(c.saturationl()<=10?((x=>x/0.8)(c.lightness()/100)*100):c.lightness())
                    return c.l(c2.l()).white(c2.white())
                })
                .map(c=>c.hue(c.hue()+10))
                .map(c=>c.black(Math.min(c.black(), oc_negrot.black())))
                .map(c=>c.lightness(Math.max(c.lightness(), c.blue()/3, oc_negrot.lightness())))
                .map(c=>c.hue(c.hue()-10))
                .map(c=>c.hue(c.lightness()>50?c.hue():hue_func(c.hue())))
                .alpha(oc.alpha())

                return final_color.hexa()
        }
        )
        fs.writeFileSync(newPath, newFileContent)
}

updateFile("./themes/original_dark_vs.json", "./themes/dark_vs.json")
updateFile("./themes/original_dark_plus.json", "./themes/dark_plus.json")
updateFile("./themes/original_theme.json", "./themes/theme.json")

