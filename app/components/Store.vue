<template>
    <Page>
        <ActionBar title="STORE" class="page">
            <ActionItem @tap="cart" ios.systemIcon="16" ios.position="right" text="Cart" android.position="popup" />
            <ActionItem @tap="logout" ios.systemIcon="16" ios.position="right" text="Logout" android.position="popup" />
        </ActionBar>

        <GridLayout rows="auto,*" verticalAlignment="top">
            <StackLayout row="1" class="meaning-card" orientation="vertical">
                <ListView class="list-group" for="item in allProducts" backgroundColor="transparent" separatorColor="transparent" style="height: 100%">
                    <v-template>
                        <GridLayout columns="50,*,*" rows="*,*" class="list-item list-item-name">
                            <Image col="0" :src="'~/assets/' +item.image_tag " class=" emoji" />
                            <Label @tap="showDetailPageModally(item)" col="1" :text="item.title" class="lab"
                                   verticalAlignment="center" />
                            <Label row="1" col="1" :text="'$' +item.price" class="lab"
                                   horizontalAlignment="left" textWrap="true" style="margin-top: 30;"/>
                            <Button @tap="addToCart(item.id)" row="1" col="2" class="purple nav-btn fas t-36 close"
                                    text.decode="&#xf217;" horizontalAlignment="right" />
                        </GridLayout>
                    </v-template>
                </ListView>
            </StackLayout>
            <ActivityIndicator rowSpan="4" :busy="processing">
            </ActivityIndicator>
        </GridLayout>
    </Page>
</template>

<script>
    import Home from "./Home";
    import Cart from "./Cart";
    import axios from "axios";
    const appSettings = require("tns-core-modules/application-settings");
    const Detail = {
        props: ["id", "title", "image_tag", "product_type", "description",
            "price"
        ],
        template: `
	<ModalStack class="modal-container">
		<GridLayout class="card modal" rows="auto,auto" verticalAlignment="middle">
			<Button row="0" @tap="$modal.close" class="fa close"
	                    text.decode="&#xf00d;" horizontalAlignment="right" />
	                <StackLayout row="1" ref="meaningContainer" class="list-item
	                    list-item-meaning">
						<Image col="0" :src="'~/assets/' + image_tag" class=" emoji_window" />
	                    <Label col="1" :text="title" class="card-title"
	                        style="text-align: center;padding-bottom: 24;" />
						    <GridLayout columns="20,*" rows="*,*,*">
	                            <Label col="1" row="0" verticalAlignment="top" :text="'$' + price"
	                                textWrap="true" style="margin-bottom:25; font-size: 16;" />
	                            <Label col="1" row="1" verticalAlignment="top" :text="description" textWrap="true"
	                                style="font-size: 16" />
						    </GridLayout>
					</StackLayout>
	        </GridLayout>
	    </ModalStack>
	`
    };
    export default {
        name: "Store",
        data() {
            return {
                processing: false,
                detailPage: Detail,
                allProducts: []
            };
        },
        methods: {
            onButtonTap() {
                console.log("Button was pressed");
            },

            getAllProducts() {
                this.processing = true;
                const token = appSettings.getString("token");
                axios.get('https://store-adonis-api.herokuapp.com/products', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then((response) => {
                    this.processing = false;
                    const prod_response = response.data.data;
                    prod_response.forEach((product, index) => {
                        this.allProducts.push({
                            id: product.id,
                            title: product.title,
                            description: product.description,
                            product_type: product.product_type,
                            image_tag: product.image_tag,
                            price: product.price
                        });
                    });
                });
            },
            showDetailPageModally(item) {
                this.processing = true;
                this.$showModal(Detail, {
                    props: {
                        id: item.id,
                        title: item.title,
                        image_tag: item.image_tag,
                        product_type: item.product_type,
                        description: item.description,
                        price: item.price
                    }
                });
                this.processing = false;
            },
            addToCart(cartItem) {
                this.processing = true;
                const token = appSettings.getString("token");
                axios.post('https://store-adonis-api.herokuapp.com/cart',
                    {
                        product_id: cartItem
                    },
                    {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(() => {
                    this.processing = false;
                    this.alert("Item successfully added to cart");
                });
            },
            cart() {
                this.processing = true;
                this.$navigateTo(Cart, {
                    clearHistory: true
                });
            },
            logout() {
                this.processing = true;
                appSettings.remove("token");
                this.$navigateTo(Home, {
                    clearHistory: true
                });
            },
            alert(message) {
                return alert({
                    title: "VUE STORE",
                    okButtonText: "OK",
                    message: message
                });
            }
        },
        created() {
            this.getAllProducts();
        }
    };
</script>

<style scoped>
    .btn-primary {
        height: 50;
        background-color: #D51A1A;
        border-radius: 5;
        font-size: 20;
        font-weight: 600;
    }
    .btn-primary:disabled {
        opacity: 0.5;
    }

    page {
        color: #FFF;
        background: linear-gradient(to right top, #2C163D, #142237);
    }

    .page {
        color: #FFF;
        background: linear-gradient(to right top, #2C163D, #142237);
    }

    .fa {
        font-family: FontAwesome, fontawesome-webfont;
        color: #FFF;
    }

    .header {
        font-size: 50;
        padding: 20;
        text-align:center;
    }

    .med {
        font-size: 18;
    }

    .lg {
        font-size: 24;
    }

    .lab {
        margin-left: 10;
    }

    .title {
        text-align: center;
        text-transform: uppercase;
        margin-top: 20;
        font-family: NunitoSans-Bold, Nunito;
        font-size: 18;
        font-weight: bold;
        color: #D3DBEA;
    }

    .card-title {
        text-align: center;
        text-transform: uppercase;
        color: #0F1E39;
        font-family: Passion, PassionOne, PassionOne-Regular;
        font-size: 30;
    }

    .card {
        border-radius: 20;
        margin: 12;
        padding: 10;
        background-color: #E3E9F8;
        color: #131636;
        height: 86%;
    }

    .nav-btn {
        color: white;
        margin: 20;
        font-size: 40;
    }

    .list-item {
        margin: 3;
        padding: 5, 12;
        color: black;
        background-color: #E3E9F8;
        font-size: 22;
        border-radius: 10;
    }

    .list-item-name {
        font-size: 22;
        font-family: Passion, PassionOne, PassionOne-Regular;
    }

    .list-item-meaning {
        font-size: 15;
        font-family: Nunito, NunitoSans, NunitoSans-Regular;
        color: #131636;
    }

    .modal {
        height: 70%;
    }

    .emoji {
        text-align: center;
        padding: 10;
        font-size: 100;
        color: #333333;
        border-color: black;
        text-shadow: 0 0 3px 0 rgb(1, 0, 0);
    }

    .reversed {
        transform: rotate(180deg);
    }

    .close {
        font-size: 25;
        color: #131636;
    }

    .emoji_window {
        height: 80;
        width: 80;
        margin-bottom: 20;
    }
    .btn-primary {
        height: 50;
        background-color: #D51A1A;
        border-radius: 5;
        font-size: 20;
        font-weight: 600;
    }
    .btn-primary:disabled {
        opacity: 0.5;
    }

</style>
