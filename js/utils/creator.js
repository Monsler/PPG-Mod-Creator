import { getBase64Image } from "./functions.js";

/**
 * This class will generate the mods zip file and the code snippets for each mod elements.
 * I could optimize it but I don't have much time for that rn.
 */
class Creator {
    /**
     * @param {Object} items All the mod elements created by the user.
     * @param {String} infos The mod informations (Mod name, author, description) 
     */
    constructor(items, { name, author, description }) {
        this.items = items;
        this.modApiRegistered = "";
        this.modjson = {
            "Name": name,
            "Author": author,
            "Description": description,
            "ModVersion": "1.0",
            "GameVersion": "1.22+",
            "ThumbnailPath": "thumb.png",
            "EntryPoint": "Mod.Mod",
            "Scripts": ["script.cs", "CategoryBuilder.cs"]
        }
    }


    /**
     * The object "create" contains the functions allowing us to use the different snippets to make a mod.
     * In each function, we just add the snippet into a string variable "this.modApiRegistered".
     * Contains:
     * - Misc (Objects)
     * - Melee
     * - Entities
     * - Explosives
     * - Firearms
     */
    create = {
        Misc: (item) => {
            // If the item contains an audio file, we will add this code in the snippet.
            let audioScriptIfAudio = "";
            if (item.data.audio != null) {
                audioScriptIfAudio = `
                AudioSource spawnSound = Instance.AddComponent<AudioSource>();
                spawnSound.minDistance = 1;
                spawnSound.maxDistance = 15;
				spawnSound.loop = false;

                AudioClip[] data = new AudioClip[]
                {
                    ModAPI.LoadSound("Sounds/${(item.data.name).replace(/ /g, "-")}.mp3")
                };

                spawnSound.clip = data[0];
                spawnSound.Play();
                `;
            }

            // Adds the snippet
            this.modApiRegistered += `
            ModAPI.Register(
                new Modification()
                {
                    OriginalItem = ModAPI.FindSpawnable("Metal Cube"),
                    NameOverride = "${item.data.name}",
                    DescriptionOverride = "${item.data.description}",
                    CategoryOverride = ModAPI.FindCategory("Misc."),
                    ThumbnailOverride = ModAPI.LoadSprite("Thumbnails/${(item.data.name).replace(/ /g, "-")}-thumb.png"),
                    AfterSpawn = (Instance) =>
                    {

                        Instance.GetComponent<PhysicalBehaviour>().InitialMass = ${item.data.weight};
                        Instance.GetComponent<PhysicalBehaviour>().TrueInitialMass = ${item.data.weight};
                        Instance.GetComponent<PhysicalBehaviour>().Properties = ModAPI.FindPhysicalProperties("${item.data.material}");
                        Instance.GetComponent<PhysicalBehaviour>().IsWeightless = ${item.data.weightless};

                        Instance.GetComponent<SpriteRenderer>().sprite = ModAPI.LoadSprite("Sprites/${(item.data.name).replace(/ /g, "-")}.png");
                        Instance.FixColliders();

                        ${audioScriptIfAudio}
                    }
                }
            );`;
        },


        Melee: (item) => {
            // Adds the snippet
            this.modApiRegistered += `
            ModAPI.Register(
                new Modification()
                {
                    OriginalItem = ModAPI.FindSpawnable("${item.data.type}"),
                    NameOverride = "${item.data.name}",
                    DescriptionOverride = "${item.data.description}",
                    CategoryOverride = ModAPI.FindCategory("Melee"),
                    ThumbnailOverride = ModAPI.LoadSprite("Thumbnails/${(item.data.name).replace(/ /g, "-")}-thumb.png"),
                    AfterSpawn = (Instance) =>
                    {
                        Instance.GetComponent<SpriteRenderer>().sprite = ModAPI.LoadSprite("Sprites/${(item.data.name).replace(/ /g, "-")}.png");
                        Instance.FixColliders();
                    }
                }
            );`;
        },


        Entities: (item) => {
            // Adds the snippet
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
                            person.SetBodyTextures(skin, flesh, bone, ${Math.floor(item.data.skinWidth / 18)});
    
                            foreach (var limb in person.Limbs)
                            {
                                limb.Health = ${item.data.health}f;
                                limb.InitialHealth = ${item.data.health}f;
                                limb.RegenerationSpeed += ${item.data.regenSpeed}f;
                            }
                        }
                    }
                );`;
        },


        Explosives: (item) => {
            // Adds the snippet
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
        },


        Firearms: (item) => {
            // Adds the snippet
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
    }


    /**
     * Will start the process of creating the mod zip file.
     * @param {String} customCategory The custom category of the mod if one is created. (Will be transmitted to the "createZipFile" function.)
     * @returns A zip file.
     */
    start(customCategory) {
        for (const item of this.items) { this.create[item.category.replace(".", "")](item); }
        return this.createZipFile(customCategory);
    }


    /**
     * This function will put everything in a single zip file that the user will be able to download.
     * @param {String} customCategory The custom category of the mod if one is created.
     * @returns Promise (Res = The zip file has been created, success. Rej = The zip file has failed.)
     */
    createZipFile(customCategory) {
        return new Promise(async (res, rej) => {
            try {

                // Create the zip archive and folders inside
                const zip = new JSZip();
                const sounds = zip.folder("Sounds");
                const thumbnails = zip.folder("Thumbnails");
                const sprites = zip.folder("Sprites");


                // Generates the image files and puts them in the zip
                for (const item of this.items) {
                    if (item.category == "Entities") {
                        thumbnails.file(`${(item.data.name).replace(/ /g, "-")}-thumb.png`, item.data.thumbnail.replace(/^data:image\/(png|jpg);base64,/, ""), { base64: true });
                        sprites.file(`${(item.data.name).replace(/ /g, "-")}-skin.png`, item.data.skin.replace(/^data:image\/(png|jpg);base64,/, ""), { base64: true });
                        sprites.file(`${(item.data.name).replace(/ /g, "-")}-flesh.png`, item.data.flesh.replace(/^data:image\/(png|jpg);base64,/, ""), { base64: true });
                        sprites.file(`${(item.data.name).replace(/ /g, "-")}-bone.png`, item.data.bone.replace(/^data:image\/(png|jpg);base64,/, ""), { base64: true });
                    } else {
                        thumbnails.file(`${(item.data.name).replace(/ /g, "-")}-thumb.png`, item.data.thumbnail.replace(/^data:image\/(png|jpg);base64,/, ""), { base64: true });
                        sprites.file(`${(item.data.name).replace(/ /g, "-")}.png`, item.data.sprite.replace(/^data:image\/(png|jpg);base64,/, ""), { base64: true });
                        if (item.data.audio != null) sounds.file(`${(item.data.name).replace(/ /g, "-")}.mp3`, item.data.audio.replace(/^data:audio\/(wav|mpeg);base64,/, ""), { base64: true });
                    }
                }
                zip.file("thumb.png", getBase64Image(document.querySelector("#preview_mod_thumb")), { base64: true });


                // Adds the CustomCategory.cs to create custom categories (SCRIPT FROM AZULE)
                zip.file("CategoryBuilder.cs", `
                using System;
                using System.Linq;
                using System.Collections.Generic;
                using UnityEngine;


                public class CategoryBuilder
                {
                    public static void Create(string name,string description, Sprite icon)
                    {
                        CatalogBehaviour manager = UnityEngine.Object.FindObjectOfType<CatalogBehaviour>();
                        if (manager.Catalog.Categories.FirstOrDefault((Category c) => c.name == name) == null)
                        {
                            Category category = ScriptableObject.CreateInstance<Category>();
                            category.name = name;
                            category.Description = description;
                            category.Icon = icon;
                            Category[] NewCategories = new Category[manager.Catalog.Categories.Length + 1];
                            Category[] categories = manager.Catalog.Categories;
                            for (int i = 0; i < categories.Length; i++)
                            {
                                NewCategories[i] = categories[i];
                            }
                            NewCategories[NewCategories.Length - 1] = category;
                            manager.Catalog.Categories = NewCategories;
                        }
                    }

                    /* Made in USSR
                    AZULE */
                }`.replace((/  |\r\n|\n|\r/gm), ""));


                // Generates the main script (script.cs) for the mod
                let _customCategory = "";
                let items = this.modApiRegistered.replace((/  |\r\n|\n|\r/gm), "")
                if (customCategory) {
                    _customCategory = `CategoryBuilder.Create("${this.modjson.Name}", "${this.modjson.Description}", ModAPI.LoadSprite("thumb.png"));`;
                    items = items.replaceAll(/ModAPI.FindCategory\((["'])(?:(?=(\\?))\2.)*?\1\)/g, `ModAPI.FindCategory("${this.modjson.Name}")`);
                }

                zip.file("script.cs", `
                /* This mod has been generated with PPG-Mod-Creator (https://cheeteau.github.io/PPG-Mod-Creator/). You can remove this comment if you want to, but if someone ever sees this, hi! If you ever wanna support me, feel free to go on my Ko-fi! https://ko-fi.com/cheeteau */
                using UnityEngine;
    
                namespace Mod
                {
                    public class Mod
                    {
                        public static void Main()
                        {
                            ${_customCategory}

                            ${items}
                        }
                    }
                }`.replace((/  |\r\n|\n|\r/gm), ""));

                // Generates mod.json
                zip.file("mod.json", JSON.stringify(this.modjson));

                // Downloads json
                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, `${this.modjson.Name}.zip`);

                // Success
                return res();
            } catch (e) {
                return rej(e); // Reject if an error occured
            }
        });
    }
}
export { Creator }