import { useParams } from "react-router-dom";
import { EmotionCategories } from "../components/EmotionCategories";
import { EmotionHeatmap } from "../components/EmotionHeatmap";
import { EmotionPercentages } from "../components/EmotionPercentages"
import { EmotionSelector } from "../components/EmotionSelector"
import { PerformanceCard } from "../components/PerformanceCard";
import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { setCurrentEmployeeId, setCurrentTeamId } from "../redux/slices/globalState";

export const Reports = () => {
    const dispatch = useAppDispatch();

    const params = useParams();

    useEffect(() => {
        if (params.employeeId) {
            dispatch(setCurrentTeamId(null));
            dispatch(setCurrentEmployeeId(params.employeeId));
        }

        if (params.teamId) {
            dispatch(setCurrentEmployeeId(null));
            dispatch(setCurrentTeamId(params.teamId));
        }
    }, [params.employeeId, params.teamId]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                // backgroundColor: "var(--light-gray)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    height: "calc(44% - 20px)",
                    width: "calc(100% - 20px)",
                    padding: "10px",
                    gap: "20px",
                }}
            >
                <EmotionSelector />

                <EmotionHeatmap />

                <EmotionCategories />
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    height: "calc(56% - 20px)",
                    width: "calc(100% - 20px)",
                    padding: "10px",
                    gap: "20px",
                }}
            >
                <EmotionPercentages />

                <PerformanceCard />
            </div>
        </div>
    );
};