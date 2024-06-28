window.onload = async () => {
    const response = await fetch("http://localhost:8080/get_json");
    const json = await response.json();
    renderRecipes(json);
};

const renderRecipes = (json) => {
    const list1 = document.getElementById("list1");
    const list2 = document.getElementById("list2");

    json.forEach((recipe, index) => {
        const { レシピ名, 写真, 材料, 作り方 } = recipe;

        const li = document.createElement("li");
        li.innerText = レシピ名;
        li.attributeStyleMap.set("cursor", "pointer");

        //リストのスタイルを設定
        Object.assign(li.style, {
            marginBottom: "100px",
            marginLeft: "60px",
            width: "80%",
            backgroundColor: "#bbbcde",
            padding: "10px 10px 10px 30px",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#522f60",
            borderRadius: "30px",
        });

        //サムネイル画像を表示
        const img = document.createElement("img");
        img.onload = () => {
            console.log("Image loaded successfully");
        };
        img.onerror = () => {
            console.error("Error occurred while loading image");
        };
        img.src = 写真;
        Object.assign(img.style, {
            width: "120px",
            height: "120px",
            objectFit: "cover",
            margin: "10px",
            borderRadius: "50%",
            border: "solid 3px #ffffff",
            float: "right",
            position: "relative",
            top: "-50px",
            right: "-50px"
        });
        li.appendChild(img);

        console.log('json.length', json.length);

        //6項目め以降は2列目に表示
        if (index < 5) {
            list1.appendChild(li);
        } else {
            list2.appendChild(li);
        }

        const addContent = () => {
            const addDiv = document.createElement("div");
            let currentItem = parseInt(recipe.レシピ番号) - 1; // Convert the current recipe index to an integer
            addDiv.className = "absolute top-0 left-0 flex flex-row items-start justify-center w-screen h-full p-10 bg-wood z-100 scroll-smooth ";
            addDiv.id = "main2";
            console.log(`詳細を表示しました。${currentItem}/${json.length}`);
            document.getElementById('main').appendChild(addDiv);

            const addLeft = document.createElement("div");
            addLeft.className = "flex flex-col items-center justify-start w-1/2 h-full bg-cover rounded-l-lg bg-leftP shadow-inner-custom";
            addDiv.appendChild(addLeft);

            const addRight = document.createElement("div");
            addRight.className = "flex flex-col items-center justify-center w-1/2 h-full bg-cover rounded-r-lg bg-rightP";
            addDiv.appendChild(addRight);

            //左側の表示
            const recipeName = document.createElement("h1");
            recipeName.className = "text-2xl font-bold text-[#44617b] w-3/4 mt-12 mb-20 ml-[100px] py-2 px-4 bg-[#bce2e8] rounded-full text-center";
            recipeName.textContent = レシピ名;
            addLeft.appendChild(recipeName);

            const recipeImage = document.createElement("img");
            recipeImage.className = "object-cover ml-[100px] mt-14 border-4 border-white shadow-2xl h-1/2";
            recipeImage.src = 写真;
            addLeft.appendChild(recipeImage);

            //右側にレシピ詳細
            const newDiv = document.createElement("div");
            newDiv.id = "description";
            newDiv.innerHTML = "<h2 class='text-2xl text-[#44617b] font-bold mt-12 py-2 px-4 bg-[#bce2e8] rounded-full text-center'>材料</h2><p class='pl-5 pt-2 text-base leading-loose'>" + 材料.join("<br>") + "</p><br>" + "<h2 class='text-2xl text-[#44617b] font-bold my-4 py-2 px-4 bg-[#bce2e8] rounded-full text-center'>作り方</h2>";
            if (Array.isArray(作り方)) {
                const ol = document.createElement('ol');
                作り方.forEach(step => {
                    const li = document.createElement('li');
                    li.textContent = step;
                    li.className = "list-decimal ml-10 mb-5 mr-5 leading-7 text-base text-[#44617b] bg-slate-50 bg-opacity-5";
                    ol.appendChild(li);
                });
                newDiv.appendChild(ol);
            } else {
                console.error('recipe.作り方 is not an array');
            }
            newDiv.classList.add("h-screen", "flex", "flex-col", "ml-8", "mr-[150px]", "overflow-y-auto", "scroll-smooth");
            addRight.appendChild(newDiv);

            //下部のフッター
            const footer = document.createElement("div");
            footer.className = "bottom-0 flex flex-row items-center justify-center w-full h-20 pl-20 mt-20 bottom-5";
            addLeft.appendChild(footer);

            //前のレシピを表示するボタン
            const backButton = document.createElement("button");
            backButton.className = "w-36 h-[30px] m-5 bg-[#bce2e8] rounded-l-full";
            backButton.textContent = "BACK";
            footer.appendChild(backButton);

            backButton.addEventListener('click', () => {
                currentItem--;

                if (currentItem <= 0) {
                    currentItem = json.length;
                }

                let prevRecipe = json[currentItem - 1];
                console.log(`${currentItem}/${json.length}`);

                recipeName.textContent = prevRecipe.レシピ名;
                recipeImage.src = prevRecipe.写真;
                newDiv.innerHTML = "<h2 class='text-2xl text-[#44617b] font-bold my-10 py-2 px-4 bg-[#bce2e8] rounded-full'>材料</h2><p class='pl-5 pt-2 text-base leading-loose'>" + prevRecipe.材料.join("<br>") + "</p><br>" + "<h2 class='text-2xl text-[#44617b] font-bold my-8 py-2 px-4 bg-[#bce2e8] rounded-full'>作り方</h2>";
                if (Array.isArray(prevRecipe.作り方)) {
                    const ol = document.createElement('ol');
                    prevRecipe.作り方.forEach(step => {
                        const li = document.createElement('li');
                        li.textContent = step;
                        li.className = "list-decimal ml-10 mb-5 mr-5 leading-7 text-base text-[#44617b] bg-slate-50 bg-opacity-5";
                        ol.appendChild(li);
                    });
                    newDiv.appendChild(ol);
                }
            });

            //閉じるボタン
            const closeButton = document.createElement("button");
            closeButton.className = "text-[#44617b] m-5 bg-[#bce2e8] rounded-full w-10 h-10";
            closeButton.textContent = "×";
            closeButton.addEventListener("click", () => {
                addDiv.remove();
            });
            footer.appendChild(closeButton);


            //次のレシピを表示するボタン

            const nextButton = document.createElement("button");
            nextButton.className = "w-36 h-[30px] m-5 bg-[#bce2e8] rounded-r-full left-[500px]";
            nextButton.textContent = "NEXT";
            footer.appendChild(nextButton);


            nextButton.addEventListener('click', () => {
                incrementAndRender();
            });

            const incrementAndRender = () => {

                console.log('Before increment:', currentItem);
                currentItem++;
                console.log('After increment:', currentItem);

                if (currentItem >= json.length) {
                    currentItem = 0; // インデックスがjsonの長さを超えたら、最初に戻します
                }

                showRecipeDetails(json[currentItem]);
            }

            let nextRecipe = json[currentItem];
            console.log(nextRecipe);
            //console.log(`${currentItem}/${json.length}`);

            const showRecipeDetails = (nextRecipe) => {
                recipeName.textContent = nextRecipe.レシピ名;
                recipeImage.src = nextRecipe.写真;
                newDiv.innerHTML = "<h2 class='text-2xl text-[#44617b] font-bold my-10 py-2 px-4 bg-[#bce2e8] rounded-full'>材料</h2><p class='pl-5 pt-2 text-base leading-loose'>" + nextRecipe.材料.join("<br>") + "</p><br>" + "<h2 class='text-2xl text-[#44617b] font-bold my-8 py-2 px-4 bg-[#bce2e8] rounded-full'>作り方</h2>";
                if (Array.isArray(nextRecipe.作り方)) {
                    const ol = document.createElement('ol');
                    nextRecipe.作り方.forEach(step => {
                        const li = document.createElement('li');
                        li.textContent = step;
                        li.className = "list-decimal ml-10 mb-5 mr-5 leading-7 text-base text-[#44617b] bg-slate-50 bg-opacity-5";
                        ol.appendChild(li);
                    });
                    newDiv.appendChild(ol);
                }
            }

            showRecipeDetails(json[currentItem]);

        };

        //クリックしたらレシピを表示
        li.addEventListener("click", addContent);
    });


};
