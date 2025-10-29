import { ASSET_IMAGES } from "@/utilities/constants/paths";
import { getAssetPath } from "@/utilities/helpers";
import { Div } from "@jumbo/shared";
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
export const CallOuts = () => {
    return (
        <>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={3.75} mb={1}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Div
                                sx={{ position: "relative", height: 0, paddingBottom: "69.5%" }}
                            >
                                <CardMedia
                                    component="img"
                                    image={getAssetPath(
                                        `${ASSET_IMAGES}/callouts/charles-deluvio.jpg`,
                                        "640x640"
                                    )}
                                    alt=""
                                    sx={{
                                        inset: 0,
                                        height: "100%",
                                        position: "absolute",
                                        borderRadius: 2,
                                    }}
                                />
                            </Div>
                        </Grid>
                        <Grid
                            size={{ xs: 12, md: 6 }}
                            sx={{
                                alignSelf: "center",
                                textAlign: { sm: "left", md: "right" },
                                order: { md: -1 },
                            }}
                        >
                            <Typography variant="h2" mb={2}>
                                Cedar Barrel Sauna
                            </Typography>
                            <Typography variant="body1" mb={2}>
                                Contrary to popular belief, Lorem Ipsum is not simply random
                                text. It has roots in a piece of classical Latin literature from
                                45 BC, making it over 2000 years old. Richard McClintock, a
                                Latin professor at Hampden-Sydney College in Virginia, looked up
                                one of the more obscure Latin words, consectetur, from a Lorem
                                Ipsum passage, and going through the cites of the word in
                                classical literature, discovered the undoubtable source.
                            </Typography>
                            <Button variant={"contained"} disableElevation>
                                View Range
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Div
                                sx={{ position: "relative", height: 0, paddingBottom: "69.5%" }}
                            >
                                <CardMedia
                                    component="img"
                                    image={getAssetPath(
                                        `${ASSET_IMAGES}/callouts/alexander-andrews.jpg`,
                                        "640x640"
                                    )}
                                    alt=""
                                    sx={{
                                        inset: 0,
                                        height: "100%",
                                        position: "absolute",
                                        borderRadius: 2,
                                    }}
                                />
                            </Div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} sx={{ alignSelf: "center" }}>
                            <Typography variant="h2" mb={2}>
                                Traditional Saunas
                            </Typography>
                            <Typography variant="body1" mb={2}>
                                Contrary to popular belief, Lorem Ipsum is not simply random
                                text. It has roots in a piece of classical Latin literature from
                                45 BC, making it over 2000 years old. Richard McClintock, a
                                Latin professor at Hampden-Sydney College in Virginia, looked up
                                one of the more obscure Latin words, consectetur, from a Lorem
                                Ipsum passage, and going through the cites of the word in
                                classical literature, discovered the undoubtable source.
                            </Typography>
                            <Button variant={"contained"} disableElevation>
                                View Range
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card>
                <Grid container>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Div
                            sx={{ position: "relative", height: 0, paddingBottom: "69.5%" }}
                        >
                            <CardMedia
                                component="img"
                                image={getAssetPath(
                                    `${ASSET_IMAGES}/callouts/giorgio-trovato.jpg`,
                                    "640x640"
                                )}
                                alt=""
                                sx={{
                                    inset: 0,
                                    height: "100%",
                                    position: "absolute",
                                }}
                            />
                        </Div>
                    </Grid>
                    <Grid
                        size={{ xs: 12, md: 6 }}
                        sx={{
                            alignSelf: "center",
                            p: 3,
                            textAlign: { sm: "left", md: "right" },
                            order: { md: -1 },
                        }}
                    >
                        <Typography variant="h2" mb={2}>
                            Cedar Barrel Sauna
                        </Typography>
                        <Typography variant="body1" mb={2}>
                            Contrary to popular belief, Lorem Ipsum is not simply random text.
                            It has roots in a piece of classical Latin literature from 45 BC,
                            making it over 2000 years old. Richard McClintock, a Latin
                            professor at Hampden-Sydney College in Virginia, looked up one of
                            the more obscure Latin words, consectetur, from a Lorem Ipsum
                            passage, and going through the cites of the word in classical
                            literature, discovered the undoubtable source.
                        </Typography>
                        <Button variant={"contained"} disableElevation>
                            View Range
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Div
                            sx={{ position: "relative", height: 0, paddingBottom: "69.5%" }}
                        >
                            <CardMedia
                                component="img"
                                image={getAssetPath(
                                    `${ASSET_IMAGES}/callouts/tangerine-newt.jpg`,
                                    "640x640"
                                )}
                                alt=""
                                sx={{
                                    inset: 0,
                                    height: "100%",
                                    position: "absolute",
                                }}
                            />
                        </Div>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} sx={{ alignSelf: "center", p: 3 }}>
                        <Typography variant="h2" mb={2}>
                            Traditional Saunas
                        </Typography>
                        <Typography variant="body1" mb={2}>
                            Contrary to popular belief, Lorem Ipsum is not simply random text.
                            It has roots in a piece of classical Latin literature from 45 BC,
                            making it over 2000 years old. Richard McClintock, a Latin
                            professor at Hampden-Sydney College in Virginia, looked up one of
                            the more obscure Latin words, consectetur, from a Lorem Ipsum
                            passage, and going through the cites of the word in classical
                            literature, discovered the undoubtable source.
                        </Typography>
                        <Button variant={"contained"} disableElevation>
                            View Range
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        </>
    )
}