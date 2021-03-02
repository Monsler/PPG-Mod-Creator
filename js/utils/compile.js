function getBase64Image(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}


/* Compiler Class */
class Compiler {
    constructor(items, { name = "Generated Mod", author = "COZAX", description = "lmao" }) {
        this.items = items;
        this.modApiRegistered = "";
        this.modjson = {
            "Name": name,
            "Author": author,
            "Description": description,
            "ModVersion": "1.0",
            "GameVersion": "1.15",
            "ThumbnailPath": "thumb.png",
            "EntryPoint": "Mod.Mod",
            "Scripts": ["script.cs"]
        }
    }

    compileEntity(item){
        this.modApiRegistered += `
        ModAPI.Register(
            new Modification()
            {
                OriginalItem = ModAPI.FindSpawnable("${item.data.type}"),
                NameOverride = "${item.data.name}",
                DescriptionOverride = "${item.data.description}",
                CategoryOverride = ModAPI.FindCategory("Entities"),
                ThumbnailOverride = ModAPI.LoadSprite("Thumbnails/${(item.data.name).replace(/ /g, "-")}-thumb.png"),
                AfterSpawn = (Instance) =>
                {
                    var skin = ModAPI.LoadTexture("Sprites/${(item.data.name).replace(/ /g, "-")}-skin.png");
                    var flesh = ModAPI.LoadTexture("Sprites/${(item.data.name).replace(/ /g, "-")}-flesh.png");
                    var bone = ModAPI.LoadTexture("Sprites/${(item.data.name).replace(/ /g, "-")}-bone.png");

                    var person = Instance.GetComponent<PersonBehaviour>();
                    person.SetBodyTextures(skin, flesh, bone, 1);
                }
            }
        );`;
    }

    compileExplosive(item){
        this.modApiRegistered += `
        ModAPI.Register(
            new Modification()
            {
                OriginalItem = ModAPI.FindSpawnable("${item.data.type}"),
                NameOverride = "${item.data.name}",
                DescriptionOverride = "${item.data.description}",
                CategoryOverride = ModAPI.FindCategory("Explosives"),
                ThumbnailOverride = ModAPI.LoadSprite("Thumbnails/${(item.data.name).replace(/ /g, "-")}-thumb.png"),
                AfterSpawn = (Instance) =>
                {
                    Instance.GetComponent<SpriteRenderer>().sprite = ModAPI.LoadSprite("Sprites/${(item.data.name).replace(/ /g, "-")}.png");
                    ExplosiveBehaviour explobehaviour = Instance.GetComponent(typeof(ExplosiveBehaviour)) as ExplosiveBehaviour;
                    explobehaviour.Range = ${item.data.range}f;
                    explobehaviour.Delay = ${item.data.delay}f;
                    Instance.FixColliders();
                }
            }
        );`;
    }

    compileWeapon(item) {
        this.modApiRegistered += `
        ModAPI.Register(
            new Modification()
            {
                OriginalItem = ModAPI.FindSpawnable("${item.data.type}"),
                NameOverride = "${item.data.name}",
                DescriptionOverride = "${item.data.description}",
                CategoryOverride = ModAPI.FindCategory("Firearms"),
                ThumbnailOverride = ModAPI.LoadSprite("Thumbnails/${(item.data.name).replace(/ /g, "-")}-thumb.png"),
                AfterSpawn = (Instance) =>
                {
                    Instance.GetComponent<SpriteRenderer>().sprite = ModAPI.LoadSprite("Sprites/${(item.data.name).replace(/ /g, "-")}.png");
                    var firearm = Instance.GetComponent<FirearmBehaviour>();

                    Cartridge customCartridge = ModAPI.FindCartridge("9mm");
                    customCartridge.name = "${item.data.name} - Cartridge";
                    customCartridge.Damage *= ${item.data.damage}f;
                    customCartridge.StartSpeed *= 1.5f;
                    customCartridge.PenetrationRandomAngleMultiplier *= 0.5f;
                    customCartridge.Recoil *= 0.7f;
                    customCartridge.ImpactForce *= ${item.data.damage}f;

                    firearm.Cartridge = customCartridge;

                    firearm.ShotSounds = new AudioClip[]
                    {
                        ModAPI.LoadSound("Sounds/${(item.data.name).replace(/ /g, "-")}.mp3")
                    };
                    Instance.FixColliders();
                }
            }
    );`;
    }

    compile() {
        for (const item of this.items) {
            if (item.category == "Firearms") this.compileWeapon(item);
            if (item.category == "Explosives") this.compileExplosive(item);
            if(item.category == "Entities") this.compileEntity(item);
        }
        return this.createZipFile();
    }

    createZipFile() {
        return new Promise(async (res, rej) => {
            try {
                const zip = new JSZip();
                const sounds = zip.folder("Sounds");
                const thumbnails = zip.folder("Thumbnails");
                const sprites = zip.folder("Sprites");

                for (const item of this.items) {
                    if(item.category == "Entities"){
                        thumbnails.file(`${(item.data.name).replace(/ /g, "-")}-thumb.png`, item.data.thumbnail.replace(/^data:image\/(png|jpg);base64,/, ""), { base64: true });
                        sprites.file(`${(item.data.name).replace(/ /g, "-")}-skin.png`, item.data.skin.replace(/^data:image\/(png|jpg);base64,/, ""), { base64: true });
                        sprites.file(`${(item.data.name).replace(/ /g, "-")}-flesh.png`, item.data.flesh.replace(/^data:image\/(png|jpg);base64,/, ""), { base64: true });
                        sprites.file(`${(item.data.name).replace(/ /g, "-")}-bone.png`, item.data.bone.replace(/^data:image\/(png|jpg);base64,/, ""), { base64: true });

                        if (item.data.audio != null) sounds.file(`${(item.data.name).replace(/ /g, "-")}.mp3`, item.data.audio.replace(/^data:audio\/(wav|mpeg);base64,/, ""), { base64: true });
                    }else{
                        thumbnails.file(`${(item.data.name).replace(/ /g, "-")}-thumb.png`, item.data.thumbnail.replace(/^data:image\/(png|jpg);base64,/, ""), { base64: true });
                        sprites.file(`${(item.data.name).replace(/ /g, "-")}.png`, item.data.sprite.replace(/^data:image\/(png|jpg);base64,/, ""), { base64: true });
                        if (item.data.audio != null) sounds.file(`${(item.data.name).replace(/ /g, "-")}.mp3`, item.data.audio.replace(/^data:audio\/(wav|mpeg);base64,/, ""), { base64: true });
                    }
                }
                zip.file("thumb.png", getBase64Image(document.querySelector("#preview_mod_thumb")), { base64: true });
    
                // Generates script.cs
                zip.file("script.cs", `
                using UnityEngine;
    
                namespace Mod
                {
                    public class Mod
                    {
                        public static void Main()
                        {
                            ${this.modApiRegistered.replace((/  |\r\n|\n|\r/gm),"")}
                        }
                    }
                }`.replace((/  |\r\n|\n|\r/gm),""));
    
                // Generates mod.json
                zip.file("mod.json", JSON.stringify(this.modjson));
                // Downloads json
                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, `${this.modjson.Name}.zip`);
                return res();
            } catch(e) {
                return rej(e);
            }
        });
    }
}
export { Compiler }