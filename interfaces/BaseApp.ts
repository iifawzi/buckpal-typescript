import express from "express"
export default interface BaseApp {
    getInstance: express.Application;
}