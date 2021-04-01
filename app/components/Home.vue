<template>
    <Page actionBarHidden="true">
        <FlexboxLayout class="page">
            <StackLayout class="form">
                <Label class="header" text="VUE STORE"></Label>

                <GridLayout rows="auto, auto, auto, auto, auto">
                    <StackLayout row="0" v-show="!isLoggingIn"
                                 class="input-field">
                        <TextField class="input" hint="First Name"
                                   :isEnabled="!processing" autocorrect="false"
                                   autocapitalizationType="none"
                                   v-model="user.first_name" returnKeyType="next"
                                   @returnPress="focusLastname"></TextField>
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>

                    <StackLayout row="1" v-show="!isLoggingIn"
                                 class="input-field">
                        <TextField class="input" ref="lastname"
                                   hint="Last Name" :isEnabled="!processing"
                                   autocorrect="false" autocapitalizationType="none"
                                   v-model="user.last_name" returnKeyType="next"
                                   @returnPress="focusEmail">
                        </TextField>
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>

                    <StackLayout row="2" class="input-field">
                        <TextField class="input" ref="email" hint="Email"
                                   :isEnabled="!processing" keyboardType="email"
                                   autocorrect="false" autocapitalizationType="none"
                                   v-model="user.email" returnKeyType="next"
                                   @returnPress="focusPhone"></TextField>
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>

                    <StackLayout row="3" v-show="!isLoggingIn"
                                 class="input-field">
                        <TextField class="input" ref="phone" hint="Phone"
                                   :isEnabled="!processing" keyboardType="phone"
                                   autocorrect="false" autocapitalizationType="none"
                                   v-model="user.phone" returnKeyType="next"
                                   @returnPress="focusPassword"></TextField>
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>

                    <StackLayout row="4" class="input-field">
                        <TextField class="input" ref="password"
                                   :isEnabled="!processing" hint="Password"
                                   secure="true" v-model="user.password"
                                   :returnKeyType="isLoggingIn ? 'done' : 'done'">
                        </TextField>
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>

                    <ActivityIndicator rowSpan="4" :busy="processing">
                    </ActivityIndicator>
                </GridLayout>

                <Button :text="isLoggingIn ? 'Log In' : 'Sign Up'"
                        :isEnabled="!processing" @tap="submit"
                        class="btn btn-primary m-t-20"></Button>
            </StackLayout>

            <Label class="login-label sign-up-label" @tap="toggleForm">
                <FormattedString>
                    <Span
                            :text="isLoggingIn ? 'Don’t have an account? ' : 'Back to Login'">
                    </Span>
                    <Span :text="isLoggingIn ? 'Sign up' : ''" class="bold">
                    </Span>
                </FormattedString>
            </Label>
        </FlexboxLayout>
    </Page>
</template>

<script>
    import Store from "./Store";
    import axios from "axios";
    const appSettings = require("tns-core-modules/application-settings");

    export default {
        name: "Home",
        data() {
            return {
                isLoggingIn: true,
                processing: false,
                user: {
                    first_name: '',
                    last_name: '',
                    email: "",
                    phone: '',
                    password: ""
                }
            };
        },
        methods: {
            toggleForm() {
                this.isLoggingIn = !this.isLoggingIn;
            },

            submit() {
                if (!this.user.email || !this.user.password) {
                    this.alert(
                        "Please provide both an email address and password."
                    );
                    return;
                }

                this.processing = true;
                if (this.isLoggingIn) {
                    this.login();
                } else {
                    this.register();
                }
            },

            async login() {
                this.processing = true;
                    axios
                        .post('https://store-adonis-api.herokuapp.com/login', {
                            email: this.user.email,
                            password: this.user.password,
                        })
                        .then(response => {
                            appSettings.setString("token", response.data.data.token);
                            this.$navigateTo(Store, {
                                clearHistory: true
                            });
                        })
                        .catch(() => {
                            this.processing = false;
                            this.alert(
                                `Invalid email/password or check your internet connectivity`
                            );
                        });
            },

            async register() {
                this.processing = true;
                axios
                    .post('https://store-adonis-api.herokuapp.com/signup', {
                        first_name: this.user.first_name,
                        last_name: this.user.last_name,
                        email: this.user.email,
                        phone: this.user.phone,
                        password: this.user.password,
                    })
                    .then(response => {
                        appSettings.setString("token", response.data.data.token);
                        this.alert("Your account was successfully created.");
                        this.$navigateTo(Store, {
                            clearHistory: true
                        });
                    })
                    .catch(() => {
                        this.processing = false;
                        this.alert(
                            `There was a problem creating the user, please try again and fill the form correctly or check your internet connectivity.`
                        );
                    });
            },


            focusPassword() {
                this.$refs.password.nativeView.focus();
            },
            focusLastname() {
                this.$refs.lastname.nativeView.focus();
            },
            focusEmail() {
                this.$refs.email.nativeView.focus();
            },
            focusPhone() {
                this.$refs.phone.nativeView.focus();
            },

            alert(message) {
                return alert({
                    title: "VUE STORE",
                    okButtonText: "OK",
                    message: message
                });
            }
        }
    };
</script>

<style scoped>
    .page {
        align-items: center;
        flex-direction: column;
    }

    .form {
        margin-left: 30;
        margin-right: 30;
        flex-grow: 2;
        vertical-align: middle;
    }

    .logo {
        margin-bottom: 12;
        height: 90;
        font-weight: bold;
    }

    .header {
        horizontal-align: center;
        font-size: 25;
        font-weight: 600;
        margin-bottom: 70;
        text-align: center;
        color: #D51A1A;
    }

    .input-field {
        margin-bottom: 25;
    }

    .input {
        font-size: 18;
        placeholder-color: #A8A8A8;
    }

    .input:disabled {
        background-color: white;
        opacity: 0.5;
    }

    .btn-primary {
        margin: 30 5 15 5;
    }

    .login-label {
        horizontal-align: center;
        color: #A8A8A8;
        font-size: 16;
    }

    .sign-up-label {
        margin-bottom: 20;
    }

    .bold {
        color: #000000;
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
